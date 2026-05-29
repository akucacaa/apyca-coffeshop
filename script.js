// --- VARIABLES ---
let cart = [];

// --- NAVBAR & MOBILE SIDE DRAWER ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileBtn = document.getElementById('close-mobile-menu');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
}
window.closeMobileMenu = () => mobileMenu.classList.add('translate-x-full');

menuBtn.addEventListener('click', toggleMobileMenu);
closeMobileBtn.addEventListener('click', window.closeMobileMenu);

let lastScroll = 0;
const navbar = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('py-2', 'shadow-md');
        navbar.classList.remove('py-3');
    } else {
        navbar.classList.remove('py-2', 'shadow-md');
        navbar.classList.add('py-3');
    }
    lastScroll = currentScroll;
});

// --- MODAL LOGIC ---
window.openMenuModal = function() {
    const modal = document.getElementById('menuModal');
    modal.classList.remove('hidden-modal');
    modal.classList.add('visible-modal');
    document.body.style.overflow = 'hidden';
}

window.closeMenuModal = function() {
    const modal = document.getElementById('menuModal');
    modal.classList.remove('visible-modal');
    modal.classList.add('hidden-modal');
    document.body.style.overflow = 'auto';
}

window.openCart = function() {
    document.getElementById('cartModal').classList.remove('hidden');
}
window.closeCart = function() {
    document.getElementById('cartModal').classList.add('hidden');
}

window.openHowToOrderModal = function() {
    document.getElementById('howToOrderModal').classList.remove('hidden');
}
window.closeHowToOrderModal = function() {
    document.getElementById('howToOrderModal').classList.add('hidden');
}
window.closeInvoice = function() {
    document.getElementById('invoiceModal').classList.add('hidden');
}

// --- TAB SWITCHING ANIMATION ---
window.switchTab = function(category) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = event.currentTarget;
    if(clickedBtn) clickedBtn.classList.add('active');

    const tabs = ['coffee', 'non-coffee', 'pastry'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if(t === category) {
            el.classList.remove('hidden');
            const items = el.querySelectorAll('.menu-card-creative');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.animation = `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`;
            });
        } else {
            el.classList.add('hidden');
        }
    });
}

// --- CART LOGIC ---
window.addToCart = function(name, price) {
    cart.push({ name, price });
    updateCartBadge();
    showToast("Ditambahkan!", `${name} masuk keranjang.`);
    renderCart();
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if(cart.length > 0) {
        badge.innerText = cart.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('totalPrice');
    container.innerHTML = '';
    
    let total = 0;
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8 text-sm">Belum ada pesanan nih... ☕️</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-xl';
            div.innerHTML = `
                <div>
                    <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                    <p class="text-xs text-pastel-pink font-medium">Rp ${item.price.toLocaleString()}</p>
                </div>
                <button onclick="removeItem(${index})" class="text-gray-400 hover:text-red-500 text-sm px-2">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            container.appendChild(div);
        });
    }
    totalEl.innerText = "Rp " + total.toLocaleString();
}

window.checkout = function() {
    if (cart.length === 0) {
        showToast("Ups!", "Keranjang masih kosong.");
        return;
    }
    let total = 0;
    cart.forEach(i => total += i.price);
    document.getElementById('invoiceTotal').innerText = "Rp " + total.toLocaleString();
    
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('invoiceModal').classList.remove('hidden');
}

// --- PROCESS ORDER (Default UI Simulation) ---
window.processOrder = function() {
    const btn = document.querySelector('#invoiceModal button[onclick="processOrder()"]');
    const originalText = btn.innerText;
    btn.innerText = "Memproses...";
    btn.disabled = true;

    // Simulasi proses (Jika Firebase gagal/terblokir, ini yang jalan)
    setTimeout(() => {
        showToast("Berhasil!", "Pesanan telah dibuat.");
        cart = [];
        updateCartBadge();
        renderCart();
        closeInvoice();
        closeMenuModal();
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1500);
}

// --- RESERVATION FORM ---
document.getElementById('reservationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    setTimeout(() => {
        showToast("Terkirim!", "Kami akan menghubungi Anda.");
        e.target.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1500);
});

// --- SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- TOAST ---
function showToast(title, msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-message').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Init animation for default tab
setTimeout(() => {
     const items = document.querySelectorAll('#tab-coffee .menu-card-creative');
     items.forEach((item, index) => {
         item.style.opacity = '0';
         item.style.animation = `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`;
     });
}, 500);