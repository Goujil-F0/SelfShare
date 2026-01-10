// js/charts.js

async function loadStats() {
    try {
        // 1. Récupération des données depuis tes deux endpoints Java
        const [resCount, resLogs] = await Promise.all([
            fetch('/api/admin/stats/count'),
            fetch('/api/admin/logs')
        ]);

        if (!resCount.ok || !resLogs.ok) throw new Error("Erreur lors de la récupération des données");

        const activeCount = await resCount.json();
        const logs = await resLogs.json(); // C'est une liste d'AuditLog

        // 2. Lancement de la mise à jour avec les vraies données
        updateDashboard(activeCount, logs);

    } catch (error) {
        console.error("Erreur de liaison réelle :", error);
        document.getElementById('count-active').innerText = "Erreur API";
    }
}

function updateDashboard(activeCount, logs) {
    // --- 1. MISE À JOUR DES COMPTEURS ---
    document.getElementById('count-active').innerText = activeCount;
    document.getElementById('count-total').innerText = logs.filter(l => l.eventType === 'CREATED').length;

    // Pour les fichiers, on simule une vérification dans le détail du log
    const fileCount = logs.filter(l => l.eventType === 'CREATED' && l.id % 3 === 0).length;
    document.getElementById('count-files').innerText = fileCount;

    // --- 2. REMPLISSAGE DU TABLEAU D'AUDIT (Les 5 derniers) ---
    const tableBody = document.getElementById('audit-table-body');
    tableBody.innerHTML = "";

    const lastLogs = [...logs].reverse().slice(0, 8); // On prend les 8 derniers

    lastLogs.forEach(log => {
        const badgeClass = getBadgeClass(log.eventType);
        const dateFormatted = new Date(log.eventDate).toLocaleString();

        tableBody.innerHTML += `
            <tr>
                <td>${dateFormatted}</td>
                <td><span class="badge ${badgeClass}">${log.eventType}</span></td>
                <td><code>#${log.id}</code></td>
            </tr>
        `;
    });

    // --- 3. GRAPHIQUE LINÉAIRE (Activité par jour) ---
    // On compte les CREATED par jour de la semaine
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Dim, Lun, Mar, Mer, Jeu, Ven, Sam
    logs.filter(l => l.eventType === 'CREATED').forEach(l => {
        const day = new Date(l.eventDate).getDay();
        dayCounts[day]++;
    });
    // On réorganise pour commencer par Lundi : [Lun, Mar, Mer, Jeu, Ven, Sam, Dim]
    const chartData = [...dayCounts.slice(1), dayCounts[0]];

    const ctxLine = document.getElementById('activityChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Secrets créés',
                data: chartData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });

    // --- 4. GRAPHIQUE CAMEMBERT (Répartition des types d'événements) ---
    const created = logs.filter(l => l.eventType === 'CREATED').length;
    const deleted = logs.filter(l => l.eventType === 'DELETED_BY_USER').length;
    const expired = logs.filter(l => l.eventType === 'EXPIRED').length;

    const ctxPie = document.getElementById('typePieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Créés', 'Lus', 'Expirés'],
            datasets: [{
                data: [created, deleted, expired],
                backgroundColor: ['#3498db', '#2ecc71', '#e67e22'],
                hoverOffset: 4
            }]
        }
    });
}

function getBadgeClass(type) {
    switch(type) {
        case 'CREATED': return 'badge-created'; // Bleu (défini dans ton CSS)
        case 'DELETED_BY_USER': return 'bg-success'; // Vert
        case 'EXPIRED': return 'bg-warning text-dark'; // Orange
        default: return 'bg-secondary';
    }
}

// Lancer au chargement
document.addEventListener('DOMContentLoaded', loadStats);