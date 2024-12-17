// Manejo del formulario de inicio de sesión
const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Guarda el token en localStorage
            alert('Inicio de sesión exitoso');
            window.location.href = './dashboard.html'; // Redirección a dashboard
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.message);
        alert('Error en el inicio de sesión');
    }
});
