// Orders/Cart page logic
document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('cart-items-container');
    const emptyCartMsg = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const subtotalEl = document.getElementById('subtotal-amount');
    const totalEl = document.getElementById('total-amount');

    initCart();

    function initCart() {
        const cart = getCart();

        if (cart.length === 0) {
            itemsContainer.parentElement.style.display = 'none';
            emptyCartMsg.style.display = 'block';
            return;
        }

        emptyCartMsg.style.display = 'none';
        itemsContainer.parentElement.style.display = 'grid';
        renderCartItems(cart);
        calculateTotals(cart);
    }

    function renderCartItems(cart) {
        itemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.style.display = 'flex';
            itemEl.style.gap = '1.5rem';
            itemEl.style.padding = '1rem 0';
            if (index !== cart.length - 1) itemEl.style.borderBottom = '1px solid var(--border-color)';

            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; border-radius: var(--radius); object-fit: cover;">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h4 style="font-weight: 700; font-size: 1.1rem;">${item.name}</h4>
                        <button class="remove-btn" style="background: none; border: none; color: var(--error); cursor: pointer; font-weight: 600;" data-index="${index}">Remove</button>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0.5rem 0;">Qty: 1</p>
                    <p style="color: var(--primary); font-weight: 700;">$${item.price.toFixed(2)}</p>
                </div>
            `;

            itemEl.querySelector('.remove-btn').addEventListener('click', () => removeItem(index));
            itemsContainer.appendChild(itemEl);
        });
    }

    function removeItem(index) {
        const cart = getCart();
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart();
        updateCartBadge();
        showNotification('Item removed from cart', 'success');
    }

    function calculateTotals(cart) {
        const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    checkoutBtn.addEventListener('click', async () => {
        if (!isAuthenticated()) {
            showNotification('Please login to complete your order', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        try {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';

            // Real API POST /orders
            const cart = getCart();
            await apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify({ items: cart, total: cart.reduce((acc, i) => acc + i.price, 0) })
            });

            // Clear Cart
            localStorage.setItem('cart', '[]');
            updateCartBadge();

            showNotification('Order placed successfully!', 'success');
            setTimeout(() => window.location.href = 'history.html', 1500);

        } catch (error) {
            showNotification(error.message || 'Checkout failed. Please try again.', 'error');
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Checkout';
        }
    });
});
