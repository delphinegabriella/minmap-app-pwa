import { login } from '../../data/api';

class LoginPage {
    async render () {
        return `
         <section class="container">
            <h1>Login</h1>
            <form id="loginForm">

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required />
            </div>

            <button type="submit">Login</button>
            </form>
         </section>
         `;
    }

    async afterRender() {
       document
      .getElementById('loginForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

       
      const response = await login ({ email, password });

      if ( response.error) {
        alert(response.message);
      } else {
        const token = response.loginResult.token;

        localStorage.setItem('token', token);

        alert('Login Berhasil!');
        window.location.hash = '#/';
      }

      });
    }

 

    }
export default LoginPage;