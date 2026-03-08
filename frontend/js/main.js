// Shared logic for the E-commerce app
document.addEventListener('DOMContentLoaded', () => {
    injectNavbar();
    injectFooter();
    initUI();
    updateCartBadge();
});

function injectNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    nav.innerHTML = `
        <div class="container nav-container">
            <a href="index.html" class="logo">
                <span style="color: var(--secondary)">Local</span>Shop
            </a>
            <div class="nav-links">
                <a href="index.html" class="nav-link">Home</a>
                <a href="products.html" class="nav-link">Products</a>
                <a href="history.html" class="nav-link">History</a>
                <a href="chatbot.html" class="nav-link">AI Help</a>
            </div>
            <div class="nav-actions">
                <div class="cart-icon" onclick="window.location.href='orders.html'">
                    <span class="cart-badge">0</span>
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div class="user-profile" onclick="window.location.href='profile.html'" style="cursor: pointer;">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <a href="login.html" class="btn btn-primary" id="auth-btn">Login</a>
                <button class="btn btn-outline" id="settings-btn" onclick="window.location.href='settings.html'" style="padding: 0.5rem;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
        </div>
    `;

    // Update login/logout button based on state
    const authBtn = document.getElementById('auth-btn');
    if (isAuthenticated()) {
        authBtn.textContent = 'Logout';
        authBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }
}

function injectFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About LocalShop</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem;">The best place to find local products at affordable prices. Modern shopping experience for everyone.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="products.html">Products</a></li>
                        <li><a href="signup.html">Join Us</a></li>
                        <li><a href="chatbot.html">AI Support</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Account</h3>
                    <ul class="footer-links">
                        <li><a href="profile.html">My Profile</a></li>
                        <li><a href="orders.html">Orders</a></li>
                        <li><a href="history.html">History</a></li>
                        <li><a href="settings.html">Settings</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Connect</h3>
                    <ul class="footer-links">
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2026 LocalShop Frontend. Designed with ❤️ for Beginners.
            </div>
        </div>
    `;
}
function initUI() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
}

// Global Cart Management
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function addToCart(product) {
    const cart = getCart();
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${product.name} added to cart!`, 'success');
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const cart = getCart();
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Global Notification System
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type === 'success' ? 'bg-success' : 'bg-error'}`;
    notif.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// API Fetch Helper
const API_BASE = 'http://localhost:8080/api';

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 && !endpoint.includes('/auth/')) {
            logout();
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Fetch error:', error);
        throw error;
    }
}

// Auth Check
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
