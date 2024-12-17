document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Recuperar el token JWT del almacenamiento local
    if (!token) {
        alert('Debes iniciar sesión primero.'); // Verificación si no hay token
        window.location.href = './login.html'; // Redirección al login
        return;
    }

    // Decodificar el token para obtener el ID del usuario autenticado
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    // Elementos del DOM
    const logoutButton = document.getElementById('logoutButton');
    const assignSpotForm = document.getElementById('assignSpotForm');
    const spotsList = document.getElementById('spotsList');
    const messageDiv = document.getElementById('message');
    const spotSelect = document.getElementById('spot');
    const addSpotForm = document.getElementById('addSpotForm');

    let spots = []; // Variable para almacenar las plazas

    // Mostrar mensajes de éxito o error en la interfaz
    const showMessage = (message, type) => {
        messageDiv.textContent = message;
        messageDiv.className = type === 'success' ? 'text-green-500' : 'text-red-500';
    };

    // Cargar todas las plazas desde el backend
    async function loadSpots() {
        try {
            const response = await fetch('http://localhost:5000/api/parking', {
                headers: { Authorization: `Bearer ${token}` }, // Token en el encabezado
            });

            if (!response.ok) throw new Error(`Error al cargar las plazas: ${response.statusText}`);

            const data = await response.json();
            spots = data.spots;

            // Renderizar la lista de plazas
            renderSpots(spots);

            // Verificar si el usuario tiene una plaza asignada
            const assignedSpot = spots.find(spot => spot.user && spot.user._id === userId);
            if (assignedSpot) {
                showMessage(`Tienes la plaza asignada: ${assignedSpot.number}`, 'success');
                assignSpotForm.style.display = 'none';
            } else {
                fillSpotSelect(spots); // Mostrar solo las plazas disponibles
            }
        } catch (error) {
            console.error('Error al cargar las plazas:', error.message);
            showMessage('Error al cargar las plazas.', 'error');
        }
    }

    // Llenar el select con plazas disponibles
    function fillSpotSelect(spotsToRender) {
        spotSelect.innerHTML = '';
        spotsToRender
            .filter(spot => !spot.isAssigned) // Filtrar solo plazas no asignadas
            .forEach(spot => {
                const option = document.createElement('option');
                option.value = spot._id;
                option.textContent = `Plaza ${spot.number} - Disponible`;
                spotSelect.appendChild(option);
            });
    }

    // Renderizar la lista de plazas en la interfaz
    function renderSpots(spotsToRender) {
        spotsList.innerHTML = '';
        spotsToRender.forEach(spot => {
            const item = document.createElement('li');
            item.textContent = `Plaza ${spot.number} - ${spot.isAssigned ? 'Asignada' : 'Disponible'}`;
            spotsList.appendChild(item);
        });
    }

    // Cerrar sesión del usuario
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Sesión cerrada.');
        window.location.href = './login.html';
    });

    // Agregar una nueva plaza
    addSpotForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const number = document.getElementById('number').value;

        try {
            const response = await fetch('http://localhost:5000/api/parking', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ number }),
            });

            const data = await response.json();
            if (response.ok) {
                showMessage(`Plaza ${data.number} creada exitosamente.`, 'success');
                addSpotForm.reset();
                loadSpots(); // Recargar la lista de plazas
            } else {
                showMessage(data.message || 'Error al crear la plaza.', 'error');
            }
        } catch (error) {
            console.error('Error al crear la plaza:', error.message);
            showMessage('Hubo un error al intentar crear la plaza.', 'error');
        }
    });

    // Asignar plaza
    assignSpotForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const spotId = spotSelect.value;

        try {
            const response = await fetch('http://localhost:5000/api/parking/assign', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spotId }),
            });

            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                loadSpots(); // Actualizar la lista de plazas
            } else {
                showMessage(data.message || 'Error al asignar la plaza.', 'error');
            }
        } catch (error) {
            console.error('Error al asignar la plaza:', error.message);
            showMessage('Hubo un error al intentar asignar la plaza.', 'error');
        }
    });

    // Búsqueda de plazas
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredSpots = spots.filter(spot =>
            spot.number.toString().includes(searchValue)
        );
        renderSpots(filteredSpots);
    });

    loadSpots();
});
