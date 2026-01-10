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
        console.error("Communication Failure");
    }
}

function updateDashboard(activeCount, logs) {
    document.getElementById('count-active').innerText = activeCount;
    document.getElementById('count-total').innerText = logs.filter(l => l.eventType === 'CREATED').length;
    document.getElementById('count-files').innerText = logs.filter(l => l.eventType === 'CREATED' && l.id % 2 === 0).length;

    const tableBody = document.getElementById('audit-table-body');
    tableBody.innerHTML = logs.reverse().slice(0, 6).map(log => `
        <tr>
            <td style="opacity: 0.5;">${new Date(log.eventDate).toLocaleTimeString()}</td>
            <td>
                <span class="status-pill" style="color: ${log.eventType === 'CREATED' ? '#00f3ff' : '#4d61ff'}; border-color: currentColor;">
                    ${log.eventType}
                </span>
            </td>
            <td><code>0x${log.id.substring(0,12)}...</code></td>
        </tr>
    `).join('');

    Chart.defaults.color = 'rgba(255, 255, 255, 0.4)';
    Chart.defaults.font.family = 'JetBrains Mono';

    // Activity Chart (Pulse style)
    const ctxLine = document.getElementById('activityChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [{
                data: [4, 2, 12, 18, 14, 25, 15],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.05)',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Doughnut Chart (High-tech Gauge style)
    new Chart(document.getElementById('typePieChart'), {
        type: 'doughnut',
        data: {
            labels: ['MSG_PLAIN', 'MSG_FILE'],
            datasets: [{
                data: [60, 40],
                backgroundColor: ['#00f3ff', '#4d61ff'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '85%',
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, padding: 20 } } }
        }
    });
}