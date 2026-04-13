import { register } from '../../data/api';

class RegisterPage {
    async render() {
        return `
        <section class="container">
            <h1>Register</h1>
            <form id="registerForm">

               <div class="form-group">
                <label for="name">Nama</label>
                <input type="text" id="name" placeholder="Nama" required />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email" required />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" required />
            </div>

            <button type="submit">Register</button>  

            </form>
        </section>
        `;
    }

    async afterRender() {
        document
        .getElementById('registerForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await register ({ name, email, password});

            if(response.error) {
                alert(response.message);
            } else {
                alert('Register Berhasil!');
                window.location.hash = '#/login';
            }
        } );
    }
}

export default RegisterPage;