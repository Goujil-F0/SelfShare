// Fonction pour charger les données depuis l'API Backend
async function loadStats() {
    try {
        // NOTE: L'étudiant A devra créer cet endpoint
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();

        // Simulation de données pour l'instant :
        const dummyData = {
            active: 12,
            total: 145,
            files: 4,
            history: [10, 15, 8, 20, 12, 25, 12], // 7 derniers jours
            types: [110, 35] // [Texte, Fichiers]
        };

        updateDashboard(dummyData);
    } catch (error) {
        console.error("Erreur lors du chargement des stats", error);
    }
}

function updateDashboard(data) {
    document.getElementById('count-active').innerText = data.active;
    document.getElementById('count-total').innerText = data.total;
    document.getElementById('count-files').innerText = data.files;

    // Graphique Linéaire (Activité)
    new Chart(document.getElementById('activityChart'), {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Secrets créés',
                data: data.history,
                borderColor: '#3498db',
                tension: 0.3
            }]
        }
    });

    // Graphique Camembert (Types)
    new Chart(document.getElementById('typePieChart'), {
        type: 'pie',
        data: {
            labels: ['Texte', 'Fichiers'],
            datasets: [{
                data: data.types,
                backgroundColor: ['#3498db', '#e67e22']
            }]
        }
    });
}

// Lancer au chargement
loadStats();