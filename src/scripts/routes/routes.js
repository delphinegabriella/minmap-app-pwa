import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddPage from '../pages/add/add-page';
import SavedPage from '../pages/saved/saved-page';

const routes = {
  '/': HomePage,
  '/about': AboutPage,
  '/login': LoginPage,
  '/register': RegisterPage,
   '/add': AddPage,
   '/saved': SavedPage,
};

export default routes;

