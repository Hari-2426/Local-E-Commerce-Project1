// History page logic
document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');
    const emptyHistoryMsg = document.getElementById('empty-history');

    initHistory();

    async function initHistory() {
        if (!isAuthenticated()) {
            showNotification('Please login to view order history', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        try {
            // Real API GET /history
            const history = await apiFetch('/orders/history');

            if (history.length === 0) {
                emptyHistoryMsg.style.display = 'block';
                return;
            }

            emptyHistoryMsg.style.display = 'none';
            renderHistory(history);
        } catch (error) {
            console.error('Failed to load history:', error);
            showNotification('Error loading history', 'error');
        }
    }

    function renderHistory(history) {
        historyContainer.innerHTML = '';

        history.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.style.background = 'var(--bg-white)';
            orderEl.style.borderRadius = 'var(--radius)';
            orderEl.style.padding = '1.5rem';
            orderEl.style.marginBottom = '1.5rem';
            orderEl.style.boxShadow = 'var(--shadow)';
            orderEl.style.border = '1px solid var(--border-color)';

            const itemsList = order.items.map(i => i.name).join(', ');

            orderEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <p style="font-weight: 700; color: var(--primary);">ORDER #${order.id}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Placed on ${order.date}</p>
                    </div>
                    <span style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: #dcfce7; color: #166534;">
                        ${order.status}
                    </span>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-size: 0.9rem; font-weight: 600;">Items: <span style="font-weight: 400; color: var(--text-muted);">${itemsList}</span></p>
                        <p style="margin-top: 0.5rem; font-weight: 800;">Total: $${typeof order.total === 'number' ? order.total.toFixed(2) : (isNaN(Number(order.total)) ? order.total : Number(order.total).toFixed(2))}</p>
                    </div>
                    <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Invoice</button>
                </div>
            `;

            historyContainer.appendChild(orderEl);
        });
    }
});
