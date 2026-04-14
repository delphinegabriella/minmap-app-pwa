import { getAllStories, deleteStory } from '../../data/idb.js';

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <h1>Saved Stories (Offline)</h1>
        <div id="saved-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await getAllStories();
    const list = document.getElementById('saved-list');

    if (!stories.length) {
      list.innerHTML = '<p>Tidak ada story offline</p>';
      return;
    }

    list.innerHTML = stories.map((story) => `
      <article style="margin-top:20px;">
        <img 
          src="${story.photoUrl}" 
          width="200" 
          alt="Foto oleh ${story.name || 'User'}"
        />
        <h2>${story.name || 'Tanpa nama'}</h2>
        <p>${story.description || '-'}</p>
        <button data-id="${story.id}" class="delete-btn">Hapus</button>
      </article>
    `).join('');

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await deleteStory(id);
        location.reload();
      });
    });
  }
}