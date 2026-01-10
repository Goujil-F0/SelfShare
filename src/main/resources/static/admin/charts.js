// js/charts.js

async function loadStats() {
    try {
        // 1. Appel au Backend (le lien réel avec la DB via l'API)
        const response = await fetch('/api/admin/logs');

        if (!response.ok) {
            throw new Error("Accès refusé ou serveur éteint");
        }

        const data = await response.json();

        // 2. On envoie les vraies données à ton tableau de bord
        updateDashboard(data);

    } catch (error) {
        console.error("Erreur de liaison réelle :", error);
        // Optionnel : afficher un message d'erreur sur le dashboard
        document.getElementById('count-active').innerText = "Erreur";
    }
}

function updateDashboard(data) {
    // 1. Mise à jour des compteurs
    document.getElementById('count-active').innerText = data.active;
    document.getElementById('count-total').innerText = data.total;
    document.getElementById('count-files').innerText = data.files;

    // 2. Remplissage du tableau d'audit
    const tableBody = document.getElementById('audit-table-body');
    tableBody.innerHTML = ""; // On vide
    data.recentLogs.forEach(log => {
        const badgeClass = getBadgeClass(log.type);
        tableBody.innerHTML += `
            <tr>
                <td>${log.date}</td>
                <td><span class="badge ${badgeClass}">${log.type}</span></td>
                <td><code>${log.id}...</code></td>
            </tr>
        `;
    });

    // 3. Graphique Linéaire (Activité)
    const ctxLine = document.getElementById('activityChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Secrets créés',
                data: data.history,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });

    // 4. Graphique Camembert (Types)
    const ctxPie = document.getElementById('typePieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Texte', 'Fichiers'],
            datasets: [{
                data: data.types,
                backgroundColor: ['#3498db', '#e67e22'],
                hoverOffset: 4
            }]
        }
    });
}

function getBadgeClass(type) {
    switch(type) {
        case 'CREATED': return 'badge-created';
        case 'DELETED_BY_USER': return 'bg-success';
        case 'EXPIRED': return 'bg-warning text-dark';
        default: return 'bg-secondary';
    }
}

// Lancer au chargement
document.addEventListener('DOMContentLoaded', loadStats);