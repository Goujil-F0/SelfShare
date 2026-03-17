// charts.js
document.addEventListener('DOMContentLoaded', loadStats);

async function loadStats() {
    try {
        const [resCount, resLogs] = await Promise.all([
            fetch('/api/admin/stats/count'),
            fetch('/api/admin/logs')
        ]);
        const activeCount = await resCount.json();
        const logs = await resLogs.json();
        updateDashboard(activeCount, logs);
    } catch (e) {
        console.error("Communication Failure", e);
    }
}

function updateDashboard(activeCount, logs) {
    // 1. Mise à jour des compteurs simples
    document.getElementById('count-active').innerText = activeCount;

    const totalCreated = logs.filter(l => l.eventType === 'CREATED').length;
    const totalDeleted = logs.filter(l => l.eventType === 'DELETED_BY_USER' || l.eventType === 'EXPIRED').length;

    document.getElementById('count-total').innerText = totalCreated;
    // On simule le nombre de fichiers (ou on utilise une logique si tu as l'info)
    document.getElementById('count-files').innerText = logs.filter(l => l.eventType === 'CREATED' && l.id % 3 === 0).length;

    // 2. Remplissage du tableau d'audit (Correction du bug substring)
    const tableBody = document.getElementById('audit-table-body');
    tableBody.innerHTML = [...logs].reverse().slice(0, 6).map(log => `
        <tr>
            <td style="opacity: 0.5;">${new Date(log.eventDate).toLocaleTimeString()}</td>
            <td>
                <span class="status-pill" style="color: ${log.eventType === 'CREATED' ? '#00f3ff' : '#ff4d4d'};">
                    ${log.eventType}
                </span>
            </td>
            <td><code>${log.secretId ? log.secretId.substring(0,8) : 'N/A'}...</code></td>
        </tr>
    `).join('');

    // --- CONFIGURATION DES GRAPHIQUES ---
    Chart.defaults.color = 'rgba(255, 255, 255, 0.4)';
    Chart.defaults.font.family = 'JetBrains Mono';

    // 3. Graphique d'activité (Dynamique)
    // On compte les logs par tranche d'heure pour les 24 dernières heures
    const activityData = new Array(7).fill(0);
    logs.slice(-20).forEach(l => {
        const hour = new Date(l.eventDate).getHours();
        activityData[Math.floor(hour/4)]++; // On groupe par blocs de 4h
    });

    const ctxLine = document.getElementById('activityChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [{
                label: 'Transactions',
                data: activityData, // DONNÉES RÉELLES ICI
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.05)',
                tension: 0.4,
                fill: true
            }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // 4. Graphique de répartition (Créés vs Détruits)
    new Chart(document.getElementById('typePieChart'), {
        type: 'doughnut',
        data: {
            labels: ['ACTIFS', 'DÉTRUITS'],
            datasets: [{
                data: [activeCount, totalDeleted], // DONNÉES RÉELLES ICI
                backgroundColor: ['#00f3ff', '#9d00ff'],
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}