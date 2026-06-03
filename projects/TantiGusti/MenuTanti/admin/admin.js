/* ============================================================
   TANTI GUSTI II — RESTAURANT OS CORE (JS)
   Logic for: Analytics, Live Orders, Stock & System State
   ============================================================ */

const pb = new PocketBase('http://127.0.0.1:8090');

// -- Elements --
const loginScreen = document.getElementById('login-screen');
const systemContainer = document.getElementById('admin-system');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const clockEl = document.getElementById('clock');
const themeToggle = document.getElementById('theme-toggle');
const restaurantStatusBtn = document.getElementById('restaurant-status-btn');
const timeFilterBtns = document.querySelectorAll('#time-filter .view-btn');

// -- Sections --
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

// -- State --
let allOrders = [];
let allProducts = [];
let settingsModel = null;
let currentFilter = 'day'; 
let charts = {};
let currentPhoneCategory = 'all';
let phoneSearchQuery = '';
let selectedPhoneProductId = null;
let selectedPhoneIngredients = [];
let selectedPhoneSupplements = [];
let selectedPhoneVariant = null;
let phoneCart = [];

// 1. AUTH & BOOTSTRAP
if (pb.authStore.isValid && pb.authStore.model) {
    initSystem();
} else {
    loginScreen.style.display = 'flex';
    systemContainer.style.display = 'none';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await pb.collection('_superusers').authWithPassword(
            document.getElementById('admin-email').value,
            document.getElementById('admin-password').value
        );
        initSystem();
    } catch (err) {
        document.getElementById('login-error').textContent = "Identifiants incorrects.";
    }
});

// FIX: Logout Functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        pb.authStore.clear();
        window.location.reload();
    });
}

function initSystem() {
    loginScreen.style.display = 'none';
    systemContainer.style.display = 'grid';
    feather.replace();
    
    startClock();
    initNavigation();
    initTimeFilters();
    initTheme();
    loadData();
    subscribeRealtime();
    
    // History filters
    document.getElementById('history-search')?.addEventListener('input', renderHistory);
    document.getElementById('filter-status')?.addEventListener('change', renderHistory);
    document.getElementById('filter-type')?.addEventListener('change', renderHistory);
}

// 2. NAVIGATION
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-section');
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(`section-${target}`);
            if (targetSection) targetSection.classList.add('active');
            
            document.getElementById('section-title').textContent = item.querySelector('span').textContent;
            
            // Render target section
            refreshSection(target);
        });
    });
}

function refreshSection(name) {
    if (name === 'dashboard') renderDashboard();
    if (name === 'live-orders') renderLiveOrders();
    if (name === 'phone-order') renderPhoneOrder();
    if (name === 'history') renderHistory();
    if (name === 'products') renderProducts();
    if (name === 'customers') renderCustomers();
    if (name === 'settings') renderSettings();
}

function initTimeFilters() {
    timeFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-range');
            renderDashboard();
        });
    });
}

// 3. DATA LOADING
async function loadData() {
    try {
        await Promise.all([
            fetchOrders(),
            fetchProducts(),
            fetchSettings()
        ]);
        renderDashboard();
        renderLiveOrders();
    } catch (e) {
        console.error("Erreur lors du chargement des données:", e);
    }
}

async function fetchOrders() {
    allOrders = await pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'order_items(order_id)'
    });
}

async function fetchProducts() {
    try {
        allProducts = await pb.collection('products').getFullList({ sort: 'category' });
        document.getElementById('stock-empty-state').style.display = allProducts.length ? 'none' : 'block';
        document.getElementById('stock-table-el').style.display = allProducts.length ? 'table' : 'none';
    } catch (e) {
        allProducts = [];
        document.getElementById('stock-empty-state').style.display = 'block';
        document.getElementById('stock-table-el').style.display = 'none';
    }
}

async function fetchSettings() {
    try {
        const settings = await pb.collection('settings').getFullList();
        if (settings.length > 0) {
            settingsModel = settings[0];
            document.getElementById('btn-init-settings').style.display = 'none';
        } else {
            document.getElementById('btn-init-settings').style.display = 'inline-block';
        }
        updateStatusUI();
    } catch (e) {
        document.getElementById('btn-init-settings').style.display = 'inline-block';
    }
}

function subscribeRealtime() {
    pb.collection('orders').subscribe('*', async ({ action, record }) => {
        if (action === 'create') {
            document.getElementById('new-order-sound').play().catch(() => {});
        }
        await fetchOrders();
        renderLiveOrders();
        const activeSection = document.querySelector('.nav-item.active').getAttribute('data-section');
        refreshSection(activeSection);
    });

    pb.collection('settings').subscribe('*', ({ record }) => {
        settingsModel = record;
        updateStatusUI();
    });
}

// 4. RENDERING SECTIONS

// --- DASHBOARD ---
function renderDashboard() {
    const filtered = filterOrdersByTime(allOrders, currentFilter);
    const finished = filtered.filter(o => o.status === 'finished');
    const revenue = finished.reduce((acc, o) => acc + o.total, 0);

    document.getElementById('kpi-rev').textContent = revenue.toFixed(2) + '€';
    document.getElementById('kpi-orders').textContent = filtered.length;
    document.getElementById('kpi-avg').textContent = filtered.length ? (revenue / filtered.length).toFixed(2) + '€' : '0,00€';
    
    // Calculate Rush Hour
    const hours = filtered.map(o => new Date(o.created).getHours());
    const rush = hours.length ? mode(hours) + ":00" : "--:--";
    document.getElementById('kpi-rush').textContent = rush;

    updateRevenueChart(filtered);
    renderTopProducts(filtered);
}

// --- LIVE ORDERS ---
function renderLiveOrders() {
    const columns = {
        pending: document.querySelector('#col-pending .orders-list'),
        preparing: document.querySelector('#col-preparing .orders-list'),
        ready: document.querySelector('#col-ready .orders-list'),
        finished: document.querySelector('#col-finished .orders-list')
    };

    Object.values(columns).forEach(c => c.innerHTML = '');
    const activeOrders = allOrders.filter(o => o.status !== 'cancelled');

    activeOrders.forEach(order => {
        const col = columns[order.status];
        if (col) col.appendChild(createOrderCard(order));
    });

    // Badges
    ['pending', 'preparing', 'ready', 'finished'].forEach(s => {
        const count = activeOrders.filter(o => o.status === s).length;
        document.querySelector(`#col-${s} .count`).textContent = count;
        if (s === 'pending') document.getElementById('live-count').textContent = count;
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    const items = order.expand?.['order_items(order_id)'] || [];
    const timeElapsed = Math.floor((new Date() - new Date(order.created)) / 60000);
    
    card.className = `order-card ${timeElapsed > 15 && order.status !== 'finished' ? 'urgent' : ''}`;
    
    card.innerHTML = `
        <div class="order-top">
            <span class="id">#${order.id.slice(-5)}</span>
            <span class="time">${new Date(order.created).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
        <div class="order-customer">${order.nom}</div>
        <div class="order-meta">
            <span>${order.phone}</span>
            <span>• ${order.order_type === 'delivery' ? '🛵 Liv.' : '🛍️ Emp.'}</span>
        </div>
        <div style="font-size:0.7rem; color:var(--text-secondary); margin-bottom:8px;">${order.adress}</div>
        <div class="order-items">
            ${items.map(i => `<div class="item-line"><span class="qty">${i.quantity}x</span> <span>${i.product_name}</span></div>`).join('')}
        </div>
        <div class="order-footer">
            <span class="order-price">${order.total.toFixed(2)}€</span>
            <div style="display:flex; gap:5px">
                ${order.order_type === 'delivery' ? `<button class="btn-secondary" onclick="openGPS('${order.adress}')" title="GPS">📍</button>` : ''}
                ${renderActionButtons(order)}
            </div>
        </div>
    `;
    return card;
}

function renderActionButtons(order) {
    if (order.status === 'pending') return `
        <button class="btn-action" onclick="updateOrderStatus('${order.id}', 'preparing')">Accepter</button>
        <button class="btn-secondary" onclick="updateOrderStatus('${order.id}', 'cancelled')" style="color:var(--danger)">✘</button>
    `;
    if (order.status === 'preparing') return `<button class="btn-action" style="background:var(--warning)" onclick="updateOrderStatus('${order.id}', 'ready')">Prêt</button>`;
    if (order.status === 'ready') return `<button class="btn-action" style="background:var(--success)" onclick="updateOrderStatus('${order.id}', 'finished')">Terminer</button>`;
    return '';
}

window.updateOrderStatus = async (id, status) => {
    await pb.collection('orders').update(id, { status });
};

window.openGPS = (address) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
};

// --- HISTORY ---
function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    const search = document.getElementById('history-search').value.toLowerCase();
    const status = document.getElementById('filter-status').value;
    const type = document.getElementById('filter-type').value;

    let filtered = allOrders;

    if (search) filtered = filtered.filter(o => o.nom.toLowerCase().includes(search));
    if (status !== 'all') filtered = filtered.filter(o => o.status === status);
    if (type !== 'all') filtered = filtered.filter(o => o.order_type === type);

    tbody.innerHTML = '';
    filtered.forEach(o => {
        const tr = document.createElement('tr');
        const items = o.expand?.['order_items(order_id)'] || [];
        tr.innerHTML = `
            <td>${new Date(o.created).toLocaleDateString()} ${new Date(o.created).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
            <td><strong>${o.nom}</strong><br><small>${o.phone}</small></td>
            <td>${o.order_type === 'delivery' ? '🛵' : '🛍️'}</td>
            <td>${o.total.toFixed(2)}€</td>
            <td><small>${items.map(i => i.product_name).join(', ')}</small></td>
            <td><span class="badge-stock ${o.status === 'finished' ? 'ok' : 'low'}">${o.status}</span></td>
            <td><button class="btn-secondary" onclick="openGPS('${o.adress}')">📍</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// --- CUSTOMERS ---
function renderCustomers() {
    const tbody = document.getElementById('customers-table-body');
    const empty = document.getElementById('customers-empty-state');
    
    // Aggregate by phone
    const clients = {};
    allOrders.forEach(o => {
        if (!clients[o.phone]) {
            clients[o.phone] = { nom: o.nom, phone: o.phone, last: o.created, count: 0, total: 0, types: [], adress: o.adress };
        }
        clients[o.phone].count++;
        clients[o.phone].total += o.total;
        clients[o.phone].types.push(o.order_type);
        if (new Date(o.created) > new Date(clients[o.phone].last)) {
            clients[o.phone].last = o.created;
            clients[o.phone].nom = o.nom;
        }
    });

    const clientList = Object.values(clients).sort((a, b) => b.total - a.total);
    tbody.innerHTML = '';
    
    if (clientList.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    clientList.forEach(c => {
        const favoriteType = mode(c.types);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.nom}</strong></td>
            <td>${c.phone}</td>
            <td>${new Date(c.last).toLocaleDateString()}</td>
            <td>${c.count}</td>
            <td>${c.total.toFixed(2)}€</td>
            <td>${favoriteType === 'delivery' ? '🛵 Liv.' : '🛍️ Emp.'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- STOCK ---
function renderProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';
    allProducts.forEach(p => {
        const tr = document.createElement('tr');
        const isLow = p.stock <= (p.threshold || 5);
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>${p.price.toFixed(2)}€</td>
            <td><span class="badge-stock ${isLow ? 'low' : 'ok'}">${p.stock}</span></td>
            <td>
                <div class="toggle-ios ${p.active ? 'active' : ''}" onclick="toggleProductState('${p.id}', ${p.active})"></div>
            </td>
            <td><button class="btn-secondary">Editer</button></td>
        `;
        tbody.appendChild(tr);
    });
}

window.toggleProductState = async (id, current) => {
    await pb.collection('products').update(id, { active: !current });
    await fetchProducts();
    renderProducts();
};

document.getElementById('btn-create-test-prod')?.addEventListener('click', async () => {
    try {
        await pb.collection('products').create({ name: "Produit Test", price: 10, stock: 50, active: true, category: "Test" });
        await fetchProducts();
        renderProducts();
    } catch (e) { alert("Action impossible : collection 'products' manquante."); }
});

// --- SETTINGS ---
function renderSettings() {
    if (!settingsModel) return;
    document.getElementById('set-close-msg').value = settingsModel.close_message || "";
    document.getElementById('set-max-orders').value = settingsModel.max_orders || 20;
}

document.getElementById('btn-save-settings')?.addEventListener('click', async () => {
    if (!settingsModel) return;
    await pb.collection('settings').update(settingsModel.id, {
        close_message: document.getElementById('set-close-msg').value,
        max_orders: parseInt(document.getElementById('set-max-orders').value)
    });
    alert("Paramètres enregistrés.");
});

document.getElementById('btn-init-settings')?.addEventListener('click', async () => {
    try {
        await pb.collection('settings').create({ open: true, close_message: "Fermé", max_orders: 20 });
        await fetchSettings();
        renderSettings();
    } catch (e) { alert("Collection 'settings' manquante."); }
});

const PHONE_SUPPLEMENT_CATEGORIES = {
    "Fromages": [
        { name: "Mozzarella", price: 1.00 },
        { name: "Burrata", price: 3.00 },
        { name: "Parmesan", price: 1.00 },
        { name: "Chèvre", price: 1.00 },
        { name: "Gorgonzola", price: 1.00 },
        { name: "Raclette", price: 1.00 },
        { name: "Reblochon", price: 1.00 },
        { name: "Emmental", price: 1.00 },
        { name: "Fromage râpé", price: 1.00 },
        { name: "Ricotta", price: 1.00 },
        { name: "Mascarpone", price: 1.00 }
    ],
    "Viandes": [
        { name: "Jambon", price: 1.00 },
        { name: "Jambon cru", price: 3.00 },
        { name: "Poulet", price: 1.00 },
        { name: "Viande hachée", price: 1.00 },
        { name: "Kebab", price: 1.00 },
        { name: "Merguez", price: 1.00 },
        { name: "Chorizo", price: 1.00 },
        { name: "Lardons", price: 1.00 },
        { name: "Bacon", price: 1.00 },
        { name: "Pepperoni", price: 1.00 },
        { name: "Salami", price: 1.00 },
        { name: "Bœuf", price: 1.00 },
        { name: "Escalope", price: 1.00 },
        { name: "Cordon bleu", price: 1.00 }
    ],
    "Poissons / Fruits de mer": [
        { name: "Thon", price: 1.00 },
        { name: "Saumon", price: 1.00 },
        { name: "Anchois", price: 1.00 },
        { name: "Crevettes", price: 1.00 },
        { name: "Fruits de mer", price: 1.00 }
    ],
    "Légumes": [
        { name: "Tomates", price: 1.00 },
        { name: "Tomates cerises", price: 3.00 },
        { name: "Poivrons", price: 1.00 },
        { name: "Champignons", price: 1.00 },
        { name: "Oignons", price: 1.00 },
        { name: "Oignons rouges", price: 1.00 },
        { name: "Aubergines", price: 1.00 },
        { name: "Courgettes", price: 1.00 },
        { name: "Pommes de terre", price: 1.00 },
        { name: "Roquette", price: 3.00 },
        { name: "Salade", price: 1.00 },
        { name: "Maïs", price: 1.00 },
        { name: "Olives noires", price: 1.00 },
        { name: "Olives vertes", price: 1.00 },
        { name: "Artichauts", price: 1.00 },
        { name: "Épinards", price: 1.00 },
        { name: "Ail", price: 1.00 }
    ],
    "Sauces": [
        { name: "Sauce tomate", price: 1.00 },
        { name: "Sauce blanche", price: 1.00 },
        { name: "Sauce barbecue", price: 1.00 },
        { name: "Sauce algérienne", price: 1.00 },
        { name: "Sauce samouraï", price: 1.00 },
        { name: "Sauce curry", price: 1.00 },
        { name: "Sauce fromagère", price: 1.00 },
        { name: "Sauce mayonnaise", price: 1.00 },
        { name: "Sauce ketchup", price: 1.00 },
        { name: "Sauce harissa", price: 1.00 },
        { name: "Sauce pesto", price: 3.00 },
        { name: "Sauce burger", price: 1.00 }
    ],
    "Œufs": [
        { name: "Œuf", price: 1.00 },
        { name: "Œuf dur", price: 1.00 },
        { name: "Œuf au plat", price: 1.00 }
    ],
    "Produits frais / Garnitures premium": [
        { name: "Burrata", price: 3.00 },
        { name: "Roquette", price: 3.00 },
        { name: "Tomates cerises", price: 3.00 },
        { name: "Parmesan râpé", price: 3.00 },
        { name: "Jambon cru", price: 3.00 },
        { name: "Pesto", price: 3.00 },
        { name: "Huile d’olive", price: 3.00 },
        { name: "Basilic frais", price: 3.00 }
    ]
};

const PHONE_PRODUCTS = [
    // PIZZAS BASE TOMATE
    {
        id: "pizza-tomate-margherita",
        name: "Margherita",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 10.00,
            "33cm": 11.00
        },
        defaultVariant: "29cm",
        ingredients: ["Fromage mozza", "oignon"],
        description: "Fromage mozza, oignon",
        available: true
    },
    {
        id: "pizza-tomate-n2",
        name: "N°2",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 11.00,
            "33cm": 13.00
        },
        defaultVariant: "29cm",
        ingredients: ["Jambon de poulet", "champignons"],
        description: "Jambon de poulet, champignons",
        available: true
    },
    {
        id: "pizza-tomate-4-fromages",
        name: "4 Fromages",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 13.00,
            "33cm": 15.00
        },
        defaultVariant: "29cm",
        ingredients: ["Chèvre", "raclette", "munster"],
        description: "Chèvre, raclette, munster",
        available: true
    },
    {
        id: "pizza-tomate-thon",
        name: "Thon",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 11.00,
            "33cm": 13.00
        },
        defaultVariant: "29cm",
        ingredients: ["Thon", "olives"],
        description: "Thon, olives",
        available: true
    },
    {
        id: "pizza-tomate-orientale",
        name: "Orientales",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 14.00,
            "33cm": 16.00
        },
        defaultVariant: "29cm",
        ingredients: ["Viande hachée", "olives", "merguez", "poivrons", "oignons"],
        description: "Viande hachée, olives, merguez, poivrons, oignons",
        available: true
    },
    {
        id: "pizza-tomate-vegetarienne",
        name: "Végétarienne",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 13.00,
            "33cm": 15.00
        },
        defaultVariant: "29cm",
        ingredients: ["Champignons", "oignons", "poivrons", "roquette", "artichauts", "asperges", "parmesan"],
        description: "Champignons, oignons, poivrons, roquette, artichauts, asperges, parmesan",
        available: true
    },
    {
        id: "pizza-tomate-royale",
        name: "Royale",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 12.00,
            "33cm": 14.00
        },
        defaultVariant: "29cm",
        ingredients: ["Viande hachée", "œuf", "poivrons"],
        description: "Viande hachée, œuf, poivrons",
        available: true
    },
    {
        id: "pizza-tomate-linda",
        name: "Linda",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 11.00,
            "33cm": 13.00
        },
        defaultVariant: "29cm",
        ingredients: ["Lardons", "œuf"],
        description: "Lardons, œuf",
        available: true
    },
    {
        id: "pizza-tomate-tanti-gusti",
        name: "Tanti Gusti",
        category: "Pizzas Base Tomate",
        type: "pizza",
        prices: {
            "29cm": 15.00,
            "33cm": 17.00
        },
        defaultVariant: "29cm",
        ingredients: ["Champignons", "oignons", "poivrons", "salami de bœuf", "jambon de poulet", "burrata"],
        description: "Champignons, oignons, poivrons, salami de bœuf, jambon de poulet, burrata",
        available: true
    },

    // PIZZAS BASE CRÈME
    {
        id: "pizza-creme-poulet-curry",
        name: "Poulet Curry",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 12.00,
            "33cm": 14.00
        },
        defaultVariant: "29cm",
        ingredients: ["Émincé de poulet curry"],
        description: "Émincé de poulet curry",
        available: true
    },
    {
        id: "pizza-creme-paesana",
        name: "Paesana",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 11.50,
            "33cm": 13.50
        },
        defaultVariant: "29cm",
        ingredients: ["Chèvre", "champignons", "lardon de volaille"],
        description: "Chèvre, champignons, lardon de volaille",
        available: true
    },
    {
        id: "pizza-creme-raclette",
        name: "Raclette",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 12.00,
            "33cm": 14.00
        },
        defaultVariant: "29cm",
        ingredients: ["Pomme de terre", "raclette", "lardon de volaille"],
        description: "Pomme de terre, raclette, lardon de volaille",
        available: true
    },
    {
        id: "pizza-creme-suitzeria",
        name: "Suitzeria",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 12.00,
            "33cm": 14.00
        },
        defaultVariant: "29cm",
        ingredients: ["Viande hachée", "oignons", "raclette"],
        description: "Viande hachée, oignons, raclette",
        available: true
    },
    {
        id: "pizza-creme-nicco",
        name: "Nicco",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 13.00,
            "33cm": 15.00
        },
        defaultVariant: "29cm",
        ingredients: ["Poulet curry", "chèvre", "raclette"],
        description: "Poulet curry, chèvre, raclette",
        available: true
    },
    {
        id: "pizza-creme-chevre-miel",
        name: "Chèvre Miel",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 10.00,
            "33cm": 12.00
        },
        defaultVariant: "29cm",
        ingredients: ["Chèvre", "miel"],
        description: "Chèvre, miel",
        available: true
    },
    {
        id: "pizza-creme-saumon",
        name: "Saumon",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 14.00,
            "33cm": 16.00
        },
        defaultVariant: "29cm",
        ingredients: ["Saumon", "boursin"],
        description: "Saumon, boursin",
        available: true
    },
    {
        id: "pizza-creme-nono",
        name: "Pizza Nono",
        category: "Pizzas Base Crème",
        type: "pizza",
        prices: {
            "29cm": 12.00,
            "33cm": 14.00
        },
        defaultVariant: "29cm",
        ingredients: ["Jambon de poulet fumé", "merguez", "brie"],
        description: "Jambon de poulet fumé, merguez, brie",
        available: true
    },

    // CHAUSSONS
    {
        id: "chausson-gratine",
        name: "Chausson Gratiné",
        category: "Chaussons",
        type: "sandwich",
        prices: {
            "Seul": 11.00,
            "Menu": 13.00
        },
        defaultVariant: "Seul",
        ingredients: ["Poulet curry ou viande hachée", "sauce au choix", "frites"],
        description: "Poulet curry ou viande hachée, sauce au choix, frites",
        available: true
    },

    // SANDWICHS CLASSIQUES
    {
        id: "sandwich-belge",
        name: "Le Belge",
        category: "Sandwichs Classiques",
        type: "sandwich",
        prices: {
            "Seul": 4.50,
            "Menu": 6.50
        },
        defaultVariant: "Seul",
        ingredients: ["Sauce au choix", "frites"],
        description: "Sauce au choix, frites",
        available: true
    },
    {
        id: "sandwich-americain-cheese",
        name: "Américain Cheese",
        category: "Sandwichs Classiques",
        type: "sandwich",
        prices: {
            "Seul": 9.00,
            "Menu": 10.00
        },
        defaultVariant: "Seul",
        ingredients: ["Steak frais", "frites", "sauce au choix", "crudités"],
        description: "Steak frais, frites, sauce au choix, crudités",
        available: true
    },
    {
        id: "sandwich-poulet",
        name: "Sandwich Poulet",
        category: "Sandwichs Classiques",
        type: "sandwich",
        prices: {
            "Seul": 9.00,
            "Menu": 10.00
        },
        defaultVariant: "Seul",
        ingredients: ["Poulet frais", "sauce au choix", "crudités"],
        description: "Poulet frais, sauce au choix, crudités",
        available: true
    },

    // SANDWICHS SPÉCIAUX
    {
        id: "sandwich-special-brie-baguette",
        name: "Brie Baguette",
        category: "Sandwichs Spéciaux",
        type: "sandwich",
        prices: {
            "Seul": 9.50,
            "Menu": 11.50
        },
        defaultVariant: "Seul",
        ingredients: ["Steak frais", "tomates", "oignons caramélisés", "poivrons grillés", "brie fondant"],
        description: "Steak frais, tomates, oignons caramélisés, poivrons grillés, brie fondant",
        available: true
    },
    {
        id: "sandwich-special-vosgien",
        name: "Le Vosgien",
        category: "Sandwichs Spéciaux",
        type: "sandwich",
        prices: {
            "Seul": 10.00,
            "Menu": 12.00
        },
        defaultVariant: "Seul",
        ingredients: ["Steak frais", "lardons de volaille", "champignons", "oignons", "munster fondant"],
        description: "Steak frais, lardons de volaille, champignons, oignons, munster fondant",
        available: true
    },
    {
        id: "sandwich-special-special",
        name: "Le Spécial",
        category: "Sandwichs Spéciaux",
        type: "sandwich",
        prices: {
            "Seul": 9.00,
            "Menu": 10.00
        },
        defaultVariant: "Seul",
        ingredients: ["Steak frais", "œuf", "oignons caramélisés", "crème fraîche", "boursin fondant"],
        description: "Steak frais, œuf, oignons caramélisés, crème fraîche, boursin fondant",
        available: true
    },

    // TEXMEX
    {
        id: "texmex-nuggets-wings-tenders-x4",
        name: "Nuggets/Wings/Tenders x4",
        category: "TexMex",
        price: 4.00,
        ingredients: [],
        description: "Nuggets/Wings/Tenders x4",
        available: true
    },
    {
        id: "texmex-nuggets-wings-tenders-x6",
        name: "Nuggets/Wings/Tenders x6",
        category: "TexMex",
        price: 6.00,
        ingredients: [],
        description: "Nuggets/Wings/Tenders x6",
        available: true
    },
    {
        id: "texmex-nuggets-wings-tenders-x12",
        name: "Nuggets/Wings/Tenders x12",
        category: "TexMex",
        price: 10.00,
        ingredients: [],
        description: "Nuggets/Wings/Tenders x12",
        available: true
    },

    // FRITES
    {
        id: "frites-petite-portion",
        name: "Portion Petite Frites",
        category: "Frites",
        price: 3.50,
        ingredients: [],
        description: "Portion Petite Frites",
        available: true
    },
    {
        id: "frites-grande-portion",
        name: "Portion Grande Frites",
        category: "Frites",
        price: 5.00,
        ingredients: [],
        description: "Portion Grande Frites",
        available: true
    },

    // DESSERTS
    {
        id: "dessert-tiramisu",
        name: "Tiramisu",
        category: "Desserts",
        price: 4.00,
        ingredients: ["Café", "mascarpone", "cacao"],
        description: "Fait maison selon stock",
        available: true
    },
    {
        id: "dessert-glace",
        name: "Glace",
        category: "Desserts",
        price: 2.50,
        ingredients: ["Parfums divers"],
        description: "Selon stock disponible",
        available: true
    },

    // BOISSONS
    {
        id: "boisson-canette-33cl",
        name: "Canette 33cl",
        category: "Boissons",
        price: 1.50,
        ingredients: [],
        description: "Canette 33cl",
        available: true
    },
    {
        id: "boisson-bouteille-1-25l",
        name: "Bouteille 1.25L",
        category: "Boissons",
        price: 3.50,
        ingredients: [],
        description: "Bouteille 1.25L",
        available: true
    },
    {
        id: "boisson-red-bull",
        name: "Red Bull",
        category: "Boissons",
        price: 2.50,
        ingredients: [],
        description: "Red Bull",
        available: true
    }
];

function renderPhoneOrder() {
    const nameInput = document.getElementById('phone-customer-name');
    const phoneInput = document.getElementById('phone-customer-phone');
    const addressInput = document.getElementById('phone-customer-address');
    const typeInput = document.getElementById('phone-order-type');
    const notesInput = document.getElementById('phone-order-notes');
    const summaryEl = document.getElementById('phone-customer-summary');

    if (!nameInput || !phoneInput || !addressInput || !typeInput || !notesInput || !summaryEl) return;

    function updateSummary() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const type = typeInput.value;
        const notes = notesInput.value.trim();

        if (!name && !phone) {
            summaryEl.innerHTML = `
                <div class="card-panel">
                    <div class="empty-state">
                        Informations client en attente.
                    </div>
                </div>
            `;
            checkPhoneSubmitState();
            return;
        }

        summaryEl.innerHTML = `
            <div class="card-panel">
                <div class="card-header">
                    <h4>Résumé Client</h4>
                </div>
                <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
                    <div><span style="color: var(--text-secondary)">Nom :</span> <strong>${name || '—'}</strong></div>
                    <div><span style="color: var(--text-secondary)">Téléphone :</span> <strong>${phone || '—'}</strong></div>
                    ${address ? `<div><span style="color: var(--text-secondary)">Adresse :</span> <strong>${address}</strong></div>` : ''}
                    <div><span style="color: var(--text-secondary)">Type :</span> <strong>${type === 'livraison' ? '🛵 Livraison' : '🛍️ À emporter'}</strong></div>
                    ${notes ? `<div><span style="color: var(--text-secondary)">Notes :</span> <strong style="color: var(--warning);">${notes}</strong></div>` : ''}
                </div>
            </div>
        `;
        checkPhoneSubmitState();
    }

    if (!nameInput.dataset.listenerAttached) {
        [nameInput, phoneInput, addressInput, notesInput].forEach(el => {
            el.addEventListener('input', updateSummary);
        });
        typeInput.addEventListener('change', updateSummary);
        nameInput.dataset.listenerAttached = 'true';
    }

    const clearBtn = document.getElementById('phone-clear-cart-btn');
    if (clearBtn && !clearBtn.dataset.listenerAttached) {
        clearBtn.addEventListener('click', clearPhoneCart);
        clearBtn.dataset.listenerAttached = 'true';
    }

    const submitBtn = document.getElementById('phone-submit-order-btn');
    if (submitBtn && !submitBtn.dataset.listenerAttached) {
        submitBtn.addEventListener('click', submitPhoneOrderToLive);
        submitBtn.dataset.listenerAttached = 'true';
    }

    updateSummary();
    initPhoneCatalog();
    renderPhoneCart();
}

function initPhoneCatalog() {
    const searchInput = document.getElementById('phone-product-search');
    const filterContainer = document.getElementById('phone-category-filters');

    if (!searchInput || !filterContainer) return;

    const categories = [
        'Tous',
        'Pizzas Base Tomate',
        'Pizzas Base Crème',
        'Chaussons',
        'Sandwichs Classiques',
        'Sandwichs Spéciaux',
        'TexMex',
        'Frites',
        'Desserts',
        'Boissons'
    ];

    filterContainer.innerHTML = categories.map(cat => {
        const value = cat === 'Tous' ? 'all' : cat;
        const isActive = currentPhoneCategory === value;
        return `<button class="phone-category-btn ${isActive ? 'active' : ''}" data-category="${value}">${cat}</button>`;
    }).join('');

    if (!searchInput.dataset.listenerAttached) {
        searchInput.addEventListener('input', (e) => {
            phoneSearchQuery = e.target.value.toLowerCase().trim();
            renderPhoneCatalogGrid();
        });
        searchInput.dataset.listenerAttached = 'true';
    }

    filterContainer.querySelectorAll('.phone-category-btn').forEach(btn => {
        btn.onclick = () => {
            filterContainer.querySelectorAll('.phone-category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPhoneCategory = btn.getAttribute('data-category');
            renderPhoneCatalogGrid();
        };
    });

    renderPhoneCatalogGrid();
    renderPhoneProductDetail();
}

function getSelectedPhoneProductPrice(product) {
    const basePrice = product.prices
        ? Number(product.prices[selectedPhoneVariant] || 0)
        : Number(product.price || 0);

    const supplementsTotal = selectedPhoneSupplements.reduce((sum, sup) => sum + Number(sup.price || 0), 0);

    return basePrice + supplementsTotal;
}

window.selectPhoneVariant = (variant) => {
    selectedPhoneVariant = variant;
    renderPhoneProductDetail();
};

window.togglePhoneSupplement = (name, price) => {
    const idx = selectedPhoneSupplements.findIndex(s => s.name === name);
    if (idx > -1) {
        selectedPhoneSupplements.splice(idx, 1);
    } else {
        selectedPhoneSupplements.push({ name, price });
    }
    renderPhoneProductDetail();
};

function renderPhoneCatalogGrid() {
    const gridEl = document.getElementById('phone-product-grid');
    if (!gridEl) return;

    const filtered = PHONE_PRODUCTS.filter(p => {
        const matchesCategory = (currentPhoneCategory === 'all' || p.category === currentPhoneCategory);
        const matchesSearch = !phoneSearchQuery || 
                              p.name.toLowerCase().includes(phoneSearchQuery) || 
                              p.category.toLowerCase().includes(phoneSearchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        gridEl.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">Aucun produit trouvé.</div>`;
        return;
    }

    gridEl.innerHTML = filtered.map(p => {
        const isActive = selectedPhoneProductId === p.id;
        const priceText = p.prices 
            ? Object.values(p.prices).map(pr => pr.toFixed(2) + '€').join(' | ')
            : p.price.toFixed(2) + '€';
        const variantsLabel = p.prices
            ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">${Object.keys(p.prices).join(' | ')}</div>`
            : '';
        return `
            <div class="phone-product-card ${isActive ? 'active' : ''}" onclick="selectPhoneProduct('${p.id}')">
                <div class="phone-product-name">${p.name}</div>
                <div class="phone-product-meta">${p.category}</div>
                ${variantsLabel}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div class="phone-product-price" style="font-size: 0.85rem; font-weight: 600;">${priceText}</div>
                    <div class="phone-product-status ${p.available ? 'ok' : 'low'}" style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 500;">
                        ${p.available ? 'Disponible' : 'Indisponible'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.selectPhoneProduct = (id) => {
    selectedPhoneProductId = id;
    const product = PHONE_PRODUCTS.find(p => p.id === id);
    if (product) {
        selectedPhoneVariant = product.defaultVariant || (product.prices ? Object.keys(product.prices)[0] : null);
        selectedPhoneIngredients = [...(product.ingredients || [])];
        selectedPhoneSupplements = [];
    } else {
        selectedPhoneVariant = null;
        selectedPhoneIngredients = [];
        selectedPhoneSupplements = [];
    }

    const gridEl = document.getElementById('phone-product-grid');
    if (gridEl) {
        gridEl.querySelectorAll('.phone-product-card').forEach(card => {
            if (card.getAttribute('onclick').includes(id)) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    renderPhoneProductDetail();
};

function renderPhoneProductDetail() {
    const detailEl = document.getElementById('phone-product-detail');
    if (!detailEl) return;

    if (!selectedPhoneProductId) {
        detailEl.innerHTML = `<div class="empty-state">Sélectionnez un produit pour voir le détail.</div>`;
        return;
    }

    const product = PHONE_PRODUCTS.find(p => p.id === selectedPhoneProductId);
    if (!product) {
        detailEl.innerHTML = `<div class="empty-state">Produit non trouvé.</div>`;
        return;
    }

    const basePrice = product.prices
        ? Number(product.prices[selectedPhoneVariant] || 0)
        : Number(product.price || 0);
    const supplementsTotal = selectedPhoneSupplements.reduce((sum, sup) => sum + Number(sup.price || 0), 0);
    const totalPrice = basePrice + supplementsTotal;

    // Variant selector HTML
    let variantSelectorHtml = '';
    if (product.prices) {
        variantSelectorHtml = `
            <div style="margin-bottom: 20px;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600; text-transform: uppercase;">Choix variante</span>
                <div class="phone-variant-selector" style="display: flex; gap: 8px;">
                    ${Object.keys(product.prices).map(v => {
                        const isActive = selectedPhoneVariant === v;
                        return `
                            <button type="button" class="phone-variant-btn ${isActive ? 'active' : ''}" onclick="selectPhoneVariant('${v}')">
                                ${v} (${product.prices[v].toFixed(2)}€)
                            </button>
                        `;
                    }).join('')}
                </div>
                ${(selectedPhoneVariant === 'Menu' && (product.type === 'sandwich' || product.category === 'Chaussons')) ? `
                    <div style="margin-top: 8px; font-size: 0.8rem; color: var(--accent); font-weight: 500;">
                        ✨ Menu : sandwich + frites + boisson
                    </div>
                ` : ''}
            </div>
        `;
    }

    let customizationHtml = '';
    if (!product.ingredients || product.ingredients.length === 0) {
        customizationHtml = `<div class="empty-state" style="padding: 10px 0; text-align: left; font-size: 0.8rem;">Ce produit ne nécessite pas de personnalisation.</div>`;
    } else {
        // Build checklist
        const listHtml = product.ingredients.map(ing => {
            const isChecked = selectedPhoneIngredients.includes(ing);
            const isRemoved = !isChecked;
            return `
                <label class="ingredient-check-item ${isRemoved ? 'removed' : ''}" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.85rem; cursor: pointer;">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePhoneIngredient('${ing.replace(/'/g, "\\'")}')">
                    <span>${ing}</span>
                </label>
            `;
        }).join('');

        customizationHtml = `<div class="ingredient-checklist">${listHtml}</div>`;
    }

    // Pizza supplements HTML
    let supplementsHtml = '';
    if (product.type === 'pizza') {
        let categoriesHtml = Object.keys(PHONE_SUPPLEMENT_CATEGORIES).map(catName => {
            const list = PHONE_SUPPLEMENT_CATEGORIES[catName];
            const listHtml = list.map(sup => {
                const isChecked = selectedPhoneSupplements.some(s => s.name === sup.name);
                return `
                    <label class="supplement-check-item ${isChecked ? 'active' : ''}" style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; cursor: pointer; color: var(--text-primary);">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePhoneSupplement('${sup.name.replace(/'/g, "\\'")}', ${sup.price})">
                        <span>${sup.name} (+${sup.price.toFixed(2)}€)</span>
                    </label>
                `;
            }).join('');
            
            return `
                <div class="supplement-category" style="margin-bottom: 12px;">
                    <div class="supplement-category-title" style="font-size: 0.8rem; color: var(--accent); font-weight: 600; margin-bottom: 6px; border-bottom: 1px solid rgba(201,164,92,0.15); padding-bottom: 2px;">${catName}</div>
                    <div class="supplement-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px;">
                        ${listHtml}
                    </div>
                </div>
            `;
        }).join('');

        supplementsHtml = `
            <div class="phone-supplements-panel" style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 15px;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px; font-weight: 600; text-transform: uppercase;">Suppléments</span>
                <div style="max-height: 250px; overflow-y: auto; padding-right: 6px;">
                    ${categoriesHtml}
                </div>
            </div>
        `;
    }

    // Build summary of modifications
    const removed = (product.ingredients || []).filter(ing => !selectedPhoneIngredients.includes(ing));
    const sups = selectedPhoneSupplements.map(s => s.name);
    let summaryHtml = '';
    if (removed.length === 0 && sups.length === 0) {
        summaryHtml = `<div class="phone-custom-summary">Aucune modification.</div>`;
    } else {
        let summaryParts = [];
        if (removed.length > 0) {
            summaryParts.push(`<span style="color: var(--danger)">Sans : <strong>${removed.join(', ')}</strong></span>`);
        }
        if (sups.length > 0) {
            summaryParts.push(`<span style="color: var(--accent)">Suppléments : <strong>${sups.join(', ')}</strong></span>`);
        }
        summaryHtml = `<div class="phone-custom-summary" style="display: flex; flex-direction: column; gap: 4px;">${summaryParts.join('')}</div>`;
    }

    // Price display with supplements breakdown
    let priceLineHtml = '';
    if (supplementsTotal > 0) {
        priceLineHtml = `
            <div class="phone-detail-price-line" style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 15px;">
                <div class="phone-detail-price-main" style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary);">${totalPrice.toFixed(2)}€</div>
                <div class="phone-detail-price-extra" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">
                    (${basePrice.toFixed(2)}€ base + ${supplementsTotal.toFixed(2)}€ supp.)
                </div>
            </div>
        `;
    } else {
        priceLineHtml = `
            <div class="phone-detail-price-line" style="margin-bottom: 15px;">
                <div class="phone-detail-price-main" style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary);">${totalPrice.toFixed(2)}€</div>
            </div>
        `;
    }

    detailEl.innerHTML = `
        <div class="card-panel" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div class="card-header" style="padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 15px;">
                    <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--accent);">${product.name}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${product.category}</span>
                </div>
                
                <div>
                    ${priceLineHtml}
                    ${variantSelectorHtml}
                    
                    <div style="margin-bottom: 20px;">
                        <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; text-transform: uppercase;">Description</span>
                        <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-primary);">${product.description || 'Pas de description.'}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px; font-weight: 600; text-transform: uppercase;">Ingrédients</span>
                        ${customizationHtml}
                    </div>
                    
                    ${supplementsHtml}
                </div>
            </div>

            <div style="border-top: 1px solid var(--border); padding-top: 15px; margin-top: 20px;">
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; text-transform: uppercase;">Résumé des modifications</span>
                <div style="font-size: 0.85rem; margin-bottom: 15px;">
                    ${summaryHtml}
                </div>

                <div class="phone-product-actions" style="display: flex; gap: 10px; align-items: center; justify-content: space-between;">
                    <div class="phone-qty-control" style="display: flex; align-items: center; gap: 6px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 4px;">
                        <button type="button" onclick="adjustDetailQty(-1)" style="background: transparent; border: none; color: #fff; width: 28px; height: 28px; font-weight: bold; cursor: pointer;">-</button>
                        <input type="number" id="phone-detail-qty" value="1" min="1" style="width: 32px; text-align: center; background: transparent; border: none; color: #fff; font-size: 0.85rem; outline: none; -moz-appearance: textfield;">
                        <button type="button" onclick="adjustDetailQty(1)" style="background: transparent; border: none; color: #fff; width: 28px; height: 28px; font-weight: bold; cursor: pointer;">+</button>
                    </div>
                    <button class="btn-action" onclick="addSelectedPhoneProductToCart()" style="flex: 1; padding: 10px; font-size: 0.85rem; font-weight: 700; height: 38px;">Ajouter à la commande</button>
                </div>
            </div>
        </div>
    `;
}

window.togglePhoneIngredient = (ingredient) => {
    const idx = selectedPhoneIngredients.indexOf(ingredient);
    if (idx > -1) {
        selectedPhoneIngredients.splice(idx, 1);
    } else {
        selectedPhoneIngredients.push(ingredient);
    }
    renderPhoneProductDetail();
};

window.adjustDetailQty = (delta) => {
    const qtyInput = document.getElementById('phone-detail-qty');
    if (qtyInput) {
        let val = parseInt(qtyInput.value) || 1;
        val += delta;
        if (val < 1) val = 1;
        qtyInput.value = val;
    }
};

function addSelectedPhoneProductToCart() {
    if (!selectedPhoneProductId) return;
    const product = PHONE_PRODUCTS.find(p => p.id === selectedPhoneProductId);
    if (!product) return;

    const qtyInput = document.getElementById('phone-detail-qty');
    const quantity = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

    // Calculate final product name
    let finalName = product.name;
    if (product.prices && selectedPhoneVariant) {
        if (product.type === 'pizza') {
            finalName = `${product.name} ${selectedPhoneVariant}`;
        } else {
            finalName = `${product.name} — ${selectedPhoneVariant}`;
        }
    }

    // Calculate dynamic price
    const finalPrice = getSelectedPhoneProductPrice(product);

    // Calculate optionsText
    const removedIngredients = (product.ingredients || []).filter(ing => !selectedPhoneIngredients.includes(ing));
    const removedText = removedIngredients.length > 0 ? `Sans : ${removedIngredients.join(', ')}` : '';
    const supplementsText = selectedPhoneSupplements.length > 0 ? `Suppléments : ${selectedPhoneSupplements.map(s => s.name).join(', ')}` : '';
    
    let optionsText = '';
    if (removedText && supplementsText) {
        optionsText = `${removedText} | ${supplementsText}`;
    } else if (removedText) {
        optionsText = removedText;
    } else if (supplementsText) {
        optionsText = supplementsText;
    }

    const lineId = 'line-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    phoneCart.push({
        lineId,
        productId: product.id,
        name: finalName,
        category: product.category,
        variant: selectedPhoneVariant,
        price: finalPrice,
        quantity,
        removedIngredients,
        supplements: [...selectedPhoneSupplements],
        optionsText
    });

    // Reset details quantity input back to 1
    if (qtyInput) qtyInput.value = 1;

    renderPhoneCart();
}

function renderPhoneCart() {
    const cartListEl = document.getElementById('phone-cart-list');
    const cartTotalEl = document.getElementById('phone-cart-total');
    if (!cartListEl || !cartTotalEl) return;

    if (phoneCart.length === 0) {
        cartListEl.innerHTML = `<div class="empty-state">Aucun produit ajouté.</div>`;
        cartTotalEl.textContent = '0,00€';
        checkPhoneSubmitState();
        return;
    }

    cartListEl.innerHTML = phoneCart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="phone-cart-item" style="display: flex; flex-direction: column; gap: 6px; padding: 12px; border-bottom: 1px solid var(--border);">
                <div class="phone-cart-item-main" style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong class="phone-cart-item-name" style="font-size: 0.9rem; color: var(--text-primary);">${item.name}</strong>
                        <div class="phone-cart-item-category" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${item.category}</div>
                        ${item.optionsText ? `<div class="phone-cart-item-options" style="font-size: 0.75rem; color: var(--danger); margin-top: 4px; font-weight: 500;">${item.optionsText}</div>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span class="phone-cart-item-price" style="font-size: 0.9rem; font-weight: 700; color: var(--accent);">${itemTotal.toFixed(2)}€</span>
                        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">${item.price.toFixed(2)}€ / u</div>
                    </div>
                </div>
                
                <div class="phone-cart-item-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                    <div class="phone-qty-control" style="display: flex; align-items: center; gap: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 2px;">
                        <button type="button" onclick="updatePhoneCartQty('${item.lineId}', -1)" style="background: transparent; border: none; color: #fff; width: 22px; height: 22px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">-</button>
                        <span style="font-size: 0.8rem; min-width: 20px; text-align: center; color: #fff;">${item.quantity}</span>
                        <button type="button" onclick="updatePhoneCartQty('${item.lineId}', 1)" style="background: transparent; border: none; color: #fff; width: 22px; height: 22px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">+</button>
                    </div>
                    
                    <button class="btn-secondary" onclick="removePhoneCartItem('${item.lineId}')" style="padding: 4px 8px; font-size: 0.7rem; border-color: rgba(248,113,113,0.2); color: var(--danger); cursor: pointer;">Supprimer</button>
                </div>
            </div>
        `;
    }).join('');

    calculatePhoneCartTotal();
    checkPhoneSubmitState();
}

function updatePhoneCartQty(lineId, delta) {
    const item = phoneCart.find(i => i.lineId === lineId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity < 1) {
        item.quantity = 1;
    }
    renderPhoneCart();
}

function removePhoneCartItem(lineId) {
    phoneCart = phoneCart.filter(i => i.lineId !== lineId);
    renderPhoneCart();
}

function calculatePhoneCartTotal() {
    const total = phoneCart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    const cartTotalEl = document.getElementById('phone-cart-total');
    if (cartTotalEl) {
        cartTotalEl.textContent = total.toFixed(2) + '€';
    }
    return total;
}

function checkPhoneSubmitState() {
    const submitBtn = document.getElementById('phone-submit-order-btn');
    if (!submitBtn) return;

    const name = document.getElementById('phone-customer-name')?.value.trim();
    const phone = document.getElementById('phone-customer-phone')?.value.trim();

    submitBtn.disabled = !name || !phone || phoneCart.length === 0;
}

function showPhoneFeedback(message, type = 'success') {
    const feedback = document.getElementById('phone-order-feedback');
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = `phone-order-feedback ${type}`;
    feedback.style.display = 'block';
}

function clearPhoneFeedback() {
    const feedback = document.getElementById('phone-order-feedback');
    if (!feedback) return;

    feedback.textContent = '';
    feedback.style.display = 'none';
}

function clearPhoneCart() {
    phoneCart = [];
    renderPhoneCart();
    checkPhoneSubmitState();
    showPhoneFeedback('Panier vidé.', 'success');
}

async function submitPhoneOrderToLive() {
    const submitBtn = document.getElementById('phone-submit-order-btn');

    const customerName = document.getElementById('phone-customer-name')?.value.trim();
    const customerPhone = document.getElementById('phone-customer-phone')?.value.trim();
    const customerAddress = document.getElementById('phone-customer-address')?.value.trim();
    const orderTypeValue = document.getElementById('phone-order-type')?.value;
    const customerNotes = document.getElementById('phone-order-notes')?.value.trim();

    clearPhoneFeedback();

    if (!customerName) {
        showPhoneFeedback('Nom client obligatoire.', 'error');
        return;
    }

    if (!customerPhone) {
        showPhoneFeedback('Téléphone obligatoire.', 'error');
        return;
    }

    if (!phoneCart.length) {
        showPhoneFeedback('Le panier téléphone est vide.', 'error');
        return;
    }

    if (orderTypeValue === 'livraison' && !customerAddress) {
        showPhoneFeedback('Adresse obligatoire pour une livraison.', 'error');
        return;
    }

    const mappedType = orderTypeValue === 'livraison' ? 'delivery' : 'pickup';
    const total = calculatePhoneCartTotal();
    console.log("TOTAL COMMANDE TÉLÉPHONE :", total, phoneCart);
    const finalNotes = customerNotes
        ? `Commande prise par téléphone. Notes : ${customerNotes}`
        : 'Commande prise par téléphone.';

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi...';
        }

        const order = await pb.collection('orders').create({
            nom: customerName,
            phone: customerPhone,
            adress: customerAddress || '',
            order_type: mappedType,
            status: 'pending',
            total: total,
            notes: finalNotes
        });

        for (const item of phoneCart) {
            await pb.collection('order_items').create({
                order_id: order.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: item.optionsText || ''
            });
        }

        phoneCart = [];
        renderPhoneCart();

        document.getElementById('phone-customer-name').value = '';
        document.getElementById('phone-customer-phone').value = '';
        document.getElementById('phone-customer-address').value = '';
        document.getElementById('phone-order-notes').value = '';

        renderPhoneOrder();

        if (typeof fetchOrders === 'function') await fetchOrders();
        if (typeof renderLiveOrders === 'function') renderLiveOrders();

        showPhoneFeedback('Commande téléphone envoyée en Live.', 'success');

    } catch (error) {
        console.error('Erreur envoi commande téléphone :', error);
        showPhoneFeedback('Erreur : la commande téléphone n’a pas été envoyée. Vérifiez PocketBase.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.textContent = 'Envoyer en Live';
        }
        checkPhoneSubmitState();
    }
}

window.clearPhoneCart = clearPhoneCart;
window.submitPhoneOrderToLive = submitPhoneOrderToLive;

window.addSelectedPhoneProductToCart = addSelectedPhoneProductToCart;
window.updatePhoneCartQty = updatePhoneCartQty;
window.removePhoneCartItem = removePhoneCartItem;
window.submitPhoneOrderToLive = submitPhoneOrderToLive;

// 5. CHARTS & STATS
function updateRevenueChart(data) {
    const emptyState = document.getElementById('chart-empty-state');
    if (data.length === 0) {
        emptyState.style.display = 'block';
        if (charts.revenue) charts.revenue.destroy();
        charts.revenue = null;
        return;
    }
    emptyState.style.display = 'none';

    // Grouping logic
    let labels = [];
    let seriesData = [];

    if (currentFilter === 'day') {
        labels = Array.from({length: 24}, (_, i) => i + "h");
        seriesData = Array(24).fill(0);
        data.forEach(o => seriesData[new Date(o.created).getHours()] += o.total);
    } else {
        // Simple day grouping for week/month
        const days = {};
        data.forEach(o => {
            const d = new Date(o.created).toLocaleDateString();
            days[d] = (days[d] || 0) + o.total;
        });
        labels = Object.keys(days);
        seriesData = Object.values(days);
    }

    const options = {
        series: [{ name: 'CA', data: seriesData }],
        chart: { type: 'area', height: 260, toolbar: {show:false} },
        colors: ['#C9A45C'],
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { categories: labels, labels: {style:{colors:'#888'}}},
        theme: { mode: 'dark' }
    };

    if (charts.revenue) charts.revenue.destroy();
    charts.revenue = new ApexCharts(document.querySelector("#revenue-chart"), options);
    charts.revenue.render();
}

function renderTopProducts(data) {
    const container = document.getElementById('top-products-list');
    const counts = {};
    data.forEach(o => {
        const items = o.expand?.['order_items(order_id)'] || [];
        items.forEach(i => {
            counts[i.product_name] = (counts[i.product_name] || 0) + i.quantity;
        });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    container.innerHTML = sorted.map(([name, qty]) => `
        <div class="item-line" style="margin-bottom:10px">
            <span>${name}</span>
            <span style="color:var(--accent); font-weight:700">${qty}</span>
        </div>
    `).join('');
}

// 6. UTILS
function filterOrdersByTime(orders, range) {
    const now = new Date();
    return orders.filter(o => {
        const date = new Date(o.created);
        if (range === 'day') return date.toDateString() === now.toDateString();
        if (range === 'week') return (now - date) / (86400000) <= 7;
        if (range === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        if (range === 'year') return date.getFullYear() === now.getFullYear();
        return true;
    });
}

function updateStatusUI() {
    const btn = restaurantStatusBtn;
    if (!settingsModel) return;
    btn.className = `status-pill ${settingsModel.open ? 'open' : ''}`;
    btn.querySelector('span:last-child').textContent = settingsModel.open ? 'Ouvert' : 'Fermé';
}

restaurantStatusBtn.addEventListener('click', async () => {
    if (!settingsModel) return;
    await pb.collection('settings').update(settingsModel.id, { open: !settingsModel.open });
});

function startClock() {
    setInterval(() => {
        clockEl.textContent = new Date().toLocaleTimeString('fr-FR');
    }, 1000);
}

function initTheme() {
    themeToggle.onclick = () => {
        document.body.classList.toggle('theme-light');
        document.body.classList.toggle('theme-dark');
        themeToggle.innerHTML = document.body.classList.contains('theme-light') ? '<i data-feather="sun"></i>' : '<i data-feather="moon"></i>';
        feather.replace();
    };
}

function mode(array) {
    if(array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++) {
        var el = array[i];
        if(modeMap[el] == null) modeMap[el] = 1;
        else modeMap[el]++;  
        if(modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}
