import { getStories } from '../data/api';


class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async showStories() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.hash = '#/login';
        return;
      }

      const response = await getStories(token);
      console.log('API RESPONSE:', response);

      if (!response || response.error) {
        console.error('Gagal ambil data:', response?.message);
        return;
      }

      this._view.showStories(response.listStory);

    } catch (error) {
      console.error('FETCH ERROR:', error);
    }
  }
}

export default HomePresenter;