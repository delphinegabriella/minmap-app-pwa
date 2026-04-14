import HomePresenter from '../../presenter/home-presenter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { deleteStory, saveStory } from '../../data/idb.js';
import { unsubscribePushNotification, subscribePushNotification } from '../../utils/push-notification.js';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        
        <button id="notifBtn">Aktifkan Notifikasi</button>
        <button id="unsubBtn">Matikan Notifikasi</button>

        <section id="stories">
          <h2>Daftar Story</h2>
          
          <label for="searchInput">Cari Story</label>
          <input type="text" id="searchInput" placeholder="Cari story..." />

          <label for="sortSelect">Urutkan Story</label>
          <select id="sortSelect">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>

          <div id="list"></div>
        </section>

        <section id="map-section">
          <h2>Peta Lokasi</h2>
          <div id="map" style="height:400px;"></div>
        </section>
      </section>
    `;
  }

  async afterRender() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    if (this._map) {
      this._map.remove();
    }

    this._map = L.map('map').setView([-6.2, 106.8], 5);

    const normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this._map);

    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');

    L.control.layers({
      Normal: normal,
      Topography: topo,
    }).addTo(this._map);

    this._markers = [];

    this._presenter = new HomePresenter(this);
    this._presenter.showStories();

    // subcribe
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        subscribePushNotification();
      });
    }

    // unsubscribe
    const unsubBtn = document.getElementById('unsubBtn');
    if (unsubBtn) {
      unsubBtn.addEventListener('click', () => {
        unsubscribePushNotification();
      });
    }

    // search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (event) => {
      const keyword = event.target.value.toLowerCase();

      const filtered = this._allstories.filter((story) =>
        story.name?.toLowerCase().includes(keyword)
      );

      this.showStories(filtered);
    });

    // sort
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (event) => {
      const value = event.target.value;

      const sorted = [...this._allstories].sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();

        return value === 'newest'
          ? timeB - timeA
          : timeA - timeB;
      });

      this.showStories(sorted);
    });
  }

  // For UI
  showStories(stories) {
    console.log('DATA STORIES:', stories);
    this._allstories = stories || [];

    const list = document.getElementById('list');

    if (!stories || stories.length === 0) {
      list.innerHTML = '<p>Tidak ada story tersedia</p>';
      return;
    }

    const storiesHTML = stories.map((story, index) => {
      const lat = Number(story.lat);
      const lon = Number(story.lon);

      return `
        <article class="story-item" data-index="${index}" style="margin-top:20px; cursor:pointer;">
          
          <img 
            src="${story.photoUrl || 'https://via.placeholder.com/200'}"
            width="200"
            alt="Foto oleh ${story.name || 'User'}"
          />

          <h2>${story.name || 'Tanpa nama'}</h2>

          <p>${story.description || 'Tidak ada deskripsi'}</p>

          <p>Tanggal: ${
            story.createdAt
              ? new Date(story.createdAt).toLocaleString()
              : '-'
          }</p>

          <p>Lokasi: ${!isNaN(lat) ? lat : '-'}, ${!isNaN(lon) ? lon : '-'}</p>

          <button class="save-btn" data-index="${index}">Save</button>
          <button class="delete-btn" data-id="${story.id}">Delete</button>

        </article>
      `;
    }).join('');

    list.innerHTML = storiesHTML;

    this._markers = [];

    stories.forEach((story, index) => {
      const lat = Number(story.lat);
      const lon = Number(story.lon);

      if (!isNaN(lat) && !isNaN(lon)) {
        const marker = L.marker([lat, lon]).addTo(this._map);

        marker.bindPopup(`
          <img src="${story.photoUrl || 'https://via.placeholder.com/100'}" width="100"><br>
          <b>${story.name || 'Tanpa nama'}</b><br>
          ${story.description || ''}
        `);

        this._markers[index] = marker;
      }
    });

    //map
    document.querySelectorAll('.story-item').forEach((el) => {
      el.addEventListener('click', () => {
        const index = el.dataset.index;
        const story = stories[index];

        const lat = Number(story.lat);
        const lon = Number(story.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          this._map.setView([lat, lon], 10);

          const marker = this._markers[index];
          if (marker) marker.openPopup();
        }
      });
    });

    // save
    document.querySelectorAll('.save-btn').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();

        const index = btn.dataset.index;
        const story = stories[index];

        saveStory(story);
        alert('Story disimpan ke offline!');
      });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();

        const id = btn.dataset.id;

        await deleteStory(id);

        const updated = this._allstories.filter(
          (story) => story.id !== id
        );

        this._allstories = updated;
        this.showStories(updated);
      });
    });
  }
}