// js/charts.js

async function loadStats() {
    try {
        // En production, décommente ceci :
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();

        // Simulation de données (Mock data)
        const dummyData = {
            active: 12,
            total: 145,
            files: 38,
            history: [5, 12, 8, 25, 18, 10, 15],
            types: [107, 38], // [Texte, Fichiers]
            recentLogs: [
                { date: "2025-12-28 14:30", type: "CREATED", id: "8af3-92bz" },
                { date: "2025-12-28 14:35", type: "DELETED_BY_USER", id: "55f1-12ax" },
                { date: "2025-12-28 15:10", type: "EXPIRED", id: "22cc-99lk" }
            ]
        };

        updateDashboard(dummyData);
    } catch (error) {
        console.error("Erreur lors du chargement des stats", error);
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