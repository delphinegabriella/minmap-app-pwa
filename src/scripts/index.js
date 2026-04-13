//css import
import '../styles/styles.css';
import { register } from './data/api';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateAuthUI();
  });
});

function updateAuthUI() {
  const token = localStorage.getItem('token');

   const loginItem = document.getElementById('loginItem');
  const registerItem = document.getElementById('registerItem');
  const logoutItem = document.getElementById('logoutItem');

  if (!loginItem || !registerItem || !logoutItem) return;

  if(token) {
    loginItem.style.display = 'none';
    registerItem.style.display = 'none';
    logoutItem.style.display = 'block';
  } else {
    loginItem.style.display = 'block';
    registerItem.style.display = 'block';
    logoutItem.style.display = 'none';
  }
}

updateAuthUI();

document.addEventListener('click',(e) => {
  if(e.target && e.target.id === 'logoutButton') {
    localStorage.removeItem('token');
    alert('logout berhasil!');
    window.location.hash = '#/login';
    updateAuthUI();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker berhasil didaftarkan');
    } catch (error) {
      console.error('Service Worker gagal:', error);
    }
  });
}

