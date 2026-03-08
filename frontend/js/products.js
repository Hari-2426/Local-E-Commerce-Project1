// Products page logic
const MOCK_PRODUCTS = [
    { id: 1, name: 'Premium Wireless Headphones', price: 199.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Immersive sound quality with industry-leading noise cancellation.' },
    { id: 2, name: 'Minimalist Smart Watch', price: 149.00, category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'Stay connected and track your fitness goals with elegance.' },
    { id: 3, name: 'Leather Weekend Bag', price: 125.00, category: 'fashion', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80', description: 'Handcrafted genuine leather bag for your short trips.' },
    { id: 4, name: 'Performance Running Shoes', price: 89.50, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', description: 'Breathable and lightweight shoes designed for speed.' },
    { id: 5, name: 'Glass Coffee Brewer', price: 45.00, category: 'home', image: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=500&q=80', description: 'Perfect pour-over coffee brewer for modern kitchens.' },
    { id: 6, name: 'Pure Essential Oils Set', price: 34.99, category: 'health', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80', description: 'Organic therapeutic grade essential oils for relaxation.' },
    { id: 7, name: 'Organic Bamboo Bedding', price: 159.00, category: 'home', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', description: 'Sustainably sourced, incredibly soft bamboo sheets.' },
    { id: 8, name: 'Retro Bluetooth Speaker', price: 79.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', description: 'Vintage design meets modern wireless audio technology.' }
];

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    const noProductsMsg = document.getElementById('no-products');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');

    // Add a manual refresh button so changes via API show up immediately
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refresh-btn';
    refreshBtn.className = 'btn btn-outline';
    refreshBtn.textContent = 'Refresh';
    refreshBtn.style.marginLeft = '0.5rem';
    searchBtn.parentNode.insertBefore(refreshBtn, searchBtn.nextSibling);
    refreshBtn.addEventListener('click', fetchProducts);

    // Automatically refresh when the user returns to the tab
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            fetchProducts();
        }
    });

    let allProducts = [];

    // Initialize Page
    fetchProducts();

    async function fetchProducts() {
        try {
            loadingSpinner.style.display = 'flex';
            productsGrid.style.display = 'none';

            // Real API
            const data = await apiFetch('/products');

            // Remove accidental duplicate products (same `id`)
            const uniqueById = new Map();
            data.forEach((product) => {
                if (product && product.id != null) {
                    uniqueById.set(product.id, product);
                }
            });
            allProducts = Array.from(uniqueById.values());

            renderProducts(allProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);

            // If we already have products loaded, keep showing them.
            // If not, fall back to mock data so the page still renders.
            if (allProducts.length === 0) {
                allProducts = MOCK_PRODUCTS;
                renderProducts(allProducts);
            }
        } finally {
            loadingSpinner.style.display = 'none';
            productsGrid.style.display = 'grid';
        }
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            noProductsMsg.style.display = 'block';
            productsGrid.style.display = 'none';
            return;
        }

        noProductsMsg.style.display = 'none';
        productsGrid.style.display = 'grid';

        products.forEach(product => {
            const imageSrc = (() => {
                if (!product.image) return 'https://via.placeholder.com/500';
                if (product.image.startsWith('http')) return product.image;
                if (product.image.startsWith('/')) return product.image;
                // If the image is a plain filename (e.g., "download.jpeg"), try the parent folder
                return `../${product.image}`;
            })();

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${imageSrc}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); font-weight: 700;">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${typeof product.price === 'number' ? product.price.toFixed(2) : (isNaN(Number(product.price)) ? product.price : Number(product.price).toFixed(2))}</p>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.4;">${product.description || ''}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary buy-btn" style="flex: 1;" data-id="${product.id}">Buy Now</button>
                        <button class="btn btn-outline add-cart-btn" style="padding: 0.5rem;" data-id="${product.id}">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </button>
                        <button class="btn btn-danger delete-btn" style="padding: 0.5rem;" data-id="${product.id}">Delete</button>
                    </div>
                </div>
            `;

            // Add Listeners
            card.querySelector('.add-cart-btn').addEventListener('click', () => {
                addToCart(product);
            });

            card.querySelector('.buy-btn').addEventListener('click', () => {
                addToCart(product);
                window.location.href = 'orders.html';
            });

            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    const confirmed = confirm(`Delete product '${product.name}'?`);
                    if (!confirmed) return;

                    try {
                        await apiFetch(`/products/${product.id}`, { method: 'DELETE' });
                        allProducts = allProducts.filter((p) => p.id !== product.id);
                        renderProducts(allProducts);
                        showNotification('Product deleted successfully', 'success');
                    } catch (error) {
                        showNotification('Failed to delete product', 'error');
                    }
                });
            }

            productsGrid.appendChild(card);
        });
    }

    // Filter and Search Logic
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || p.category === category;
            return matchesSearch && matchesCategory;
        });

        renderProducts(filtered);
    }

    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
    });
    categoryFilter.addEventListener('change', applyFilters);
});
