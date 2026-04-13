import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


export default class AddPage {
    async render () {
        return `
        <main class="container">
          <section>
        <h1>Tambah Story</h1>

        <form id="storyForm">
          <div class="form-group">
     <label for="photo">Foto</label>
     <input type="file" id="photo" accept="image/*" required />
          </div>

         <div class="form-group">
     <label for="description">Deskripsi</label>
     <textarea id="description" required></textarea>
         </div>

          <div id="map" style="height:300px;"></div>

          <button type="submit">Kirim</button>
        </form>
      </section>
      </main>
        `;
    }
    async afterRender() {
      this._lat = null;
      this._lon = null;
      
      this._map = L.map('map').setView([-6.2, 106.8], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(this._map);

    let marker;

    this._map.on('click', (e) => {
        const { lat, lng} = e.latlng;

        this._lat = lat;
        this._lon = lng;

        if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(this._map);
    }

    });

    document.getElementById('storyForm')
  .addEventListener('submit', async (e) => {
    console.log("FORM DIKIRIM");
    e.preventDefault();

    const file = document.getElementById('photo').files[0];
    console.log("FILE:", file);
    const description = document.getElementById('description').value;

      if (!file) {
  alert('Pilih gambar !');
  return;
}
if (!description) {
  alert(' deskripsi!');
  return;
}
if (!this._lat) {
  alert('Klik lokasi di map!');
  return;
}

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('description', description);
      formData.append('lat', this._lat);
      formData.append('lon', this._lon);

      await this._sendData(formData);
    });



   }



async _sendData(formData) {
    try{
  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  const result = await response.json();
  console.log("RESPONSE:", result);

    if (!response.ok) {
      alert('Gagal: ' + result.message);
    } else {
      alert('Story berhasil dikirim!');
      window.location.hash = '/'; 
    }

  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat mengirim data!');
  }
}
}


