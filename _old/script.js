// ══════════ INITIALIZATION ══════════
document.addEventListener('DOMContentLoaded', () => {
    // Hide Loader
    const loader = document.getElementById('page-loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // Init AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Init Stats Counter
    initCounters();
});

// ══════════ HEADER SCROLL ══════════
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ══════════ STATS COUNTER ══════════
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = target / speed;

        const updateCount = () => {
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count).toLocaleString() + (target >= 1000 ? '+' : '');
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString() + '+';
            }
        };
        updateCount();
    };

    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// ══════════ TAB SWITCHER ══════════
function switchTab(tab) {
    // Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');

    // Panels
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('panel-' + tab).classList.add('active');
}

// ══════════ MODAL LOGIC ══════════
const modal = document.getElementById('auth-modal');
const modalTitle = document.getElementById('modal-title');
const modalSub = document.getElementById('modal-subtitle');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('modal-submit-btn');
const switchText = document.getElementById('modal-switch');
const roleToggle = document.getElementById('role-toggle');

let currentMode = 'signup'; // signup or login
let currentRole = 'merchant'; // merchant or rider

function openModal(mode, role) {
    currentMode = mode;
    if (role) currentRole = role;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    updateModalUI();
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('role-' + role).classList.add('active');
}

function updateModalUI() {
    if (currentMode === 'signup') {
        modalTitle.innerText = 'Create Account';
        modalSub.innerText = 'Join the Deliverydei family';
        nameGroup.style.display = 'block';
        submitBtn.innerHTML = `Create Account <i class="fa-solid fa-arrow-right"></i>`;
        switchText.innerHTML = `Already have an account? <a href="#" onclick="toggleMode()">Login here</a>`;
        roleToggle.style.display = 'flex';
    } else {
        modalTitle.innerText = 'Welcome Back';
        modalSub.innerText = 'Sign in to your Deliverydei dashboard';
        nameGroup.style.display = 'none';
        submitBtn.innerHTML = `Sign In <i class="fa-solid fa-right-to-bracket"></i>`;
        switchText.innerHTML = `Don't have an account? <a href="#" onclick="toggleMode()">Sign up here</a>`;
        roleToggle.style.display = 'flex'; // Keep role toggle so they can choose which account to login to
    }
    
    // Set active role button
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('role-' + currentRole).classList.add('active');
}

function toggleMode() {
    currentMode = currentMode === 'signup' ? 'login' : 'signup';
    updateModalUI();
}

// Custom Submit for Inline Forms & Modals
function submitJoin(type) {
    const name = document.getElementById(type === 'merchant' ? 'm-name' : 'r-name').value;
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }
    showToast(`Welcome ${name}! Your ${type} account request has been sent.`, 'success');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('modal-phone').value;
    if (phone) {
        showToast(currentMode === 'signup' ? 'Account created successfully!' : 'Logged in successfully!', 'success');
        setTimeout(closeModal, 1500);
    }
}

// ══════════ TOAST NOTIFICATIONS ══════════
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Style for toast (minimalist)
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 1rem 2rem;
        background: #333;
        color: white;
        border-radius: 50px;
        z-index: 3000;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .toast.show {
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(style);

// ══════════ HAMBURGER MENU ══════════
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
});

// Mobile menu CSS for script.js to handle
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @media (max-width: 1024px) {
        .nav-links {
            position: fixed;
            top: 0; right: -100%;
            height: 100vh; width: 80%;
            background: white;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
            transition: 0.5s;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
        }
        .nav-links.mobile-active { right: 0; }
        .hamburger {
            display: flex; flex-direction: column; gap: 5px;
            cursor: pointer; z-index: 1001; background: none; border: none;
        }
        .hamburger span {
            width: 30px; height: 3px; background: var(--s);
            transition: 0.3s; border-radius: 5px;
        }
        .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }
    }
`;
document.head.appendChild(mobileStyle);

// ══════════ ADVANCED CALCULATOR & MAP ══════════
let selectedService = 'scheduled';
let map;
let routingControl = null;
let currentPoints = { pickup: null, delivery: null };
let currentRoadDistance = 0;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

function initMap() {
    const dhakaCoords = [23.8103, 90.4125];
    if (document.getElementById('dhaka-map')) {
        map = L.map('dhaka-map', {
            zoomControl: false,
            scrollWheelZoom: true
        }).setView(dhakaCoords, 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        map.on('click', function(e) {
            if (!currentPoints.pickup) {
                setMapPoint('pickup', e.latlng);
            } else if (!currentPoints.delivery) {
                setMapPoint('delivery', e.latlng);
            } else {
                currentPoints.pickup = null;
                currentPoints.delivery = null;
                if (routingControl) map.removeControl(routingControl);
                setMapPoint('pickup', e.latlng);
            }
        });
    }
}

async function handleInput(type) {
    const input = document.getElementById(`${type}-search`);
    const box = document.getElementById(`${type}-suggestions`);
    const q = input.value;

    if (q.length < 3) {
        box.style.display = 'none';
        return;
    }

    try {
        // Search bounded to Dhaka area for better local recommendations
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=bd&limit=5&viewbox=90.3,23.6,90.5,23.9&bounded=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            box.innerHTML = '';
            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                // Clean the name to shown Main Area, Sub Area
                const parts = item.display_name.split(',');
                const displayName = parts[0] + (parts[1] ? ', ' + parts[1] : '');
                
                div.innerText = displayName;
                div.onclick = () => selectSuggestion(type, item.lat, item.lon, displayName);
                box.appendChild(div);
            });
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    } catch (err) {
        console.error(err);
    }
}

function selectSuggestion(type, lat, lon, name) {
    document.getElementById(`${type}-search`).value = name;
    document.getElementById(`${type}-suggestions`).style.display = 'none';
    const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
    setMapPoint(type, latlng);
    map.setView(latlng, 15);
}

function setMapPoint(type, latlng) {
    currentPoints[type] = latlng;
    
    if (currentPoints.pickup && currentPoints.delivery) {
        updateRoadRoute();
    } else {
        // Just show a temporary marker if only one point
        L.marker(latlng).addTo(map).bindPopup(type.toUpperCase()).openPopup();
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} set!`, 'success');
    }
}

function updateRoadRoute() {
    if (routingControl) map.removeControl(routingControl);

    // Show "Calculating" state
    document.getElementById('main-dist-text').innerText = "...";

    routingControl = L.Routing.control({
        waypoints: [
            currentPoints.pickup,
            currentPoints.delivery
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
            styles: [{ color: '#FF6B00', weight: 6, opacity: 0.8 }]
        },
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
                draggable: true,
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<i class="fa-solid fa-location-dot" style="color:${i === 0 ? '#10b981' : '#ef4444'}; font-size:24px;"></i>`
                })
            });
        },
        addWaypoints: false,
        routeWhileDragging: true,
        show: false 
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        // Total distance is in meters, convert to KM
        currentRoadDistance = (summary.totalDistance / 1000).toFixed(1);
        
        // Update the UI immediately
        document.getElementById('main-dist-text').innerText = currentRoadDistance;
        calculateAdvancedPrice();
    });

    routingControl.on('routingerror', function(e) {
        document.getElementById('main-dist-text').innerText = "0";
        showToast('Road route not found. Try points on reachable roads.', 'error');
    });
}

function setService(service, btn) {
    selectedService = service;
    document.querySelectorAll('.service-pills .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculateAdvancedPrice();
}

function calculateAdvancedPrice() {
    const weightEl = document.getElementById('main-weight');
    const itemEl = document.getElementById('main-item');
    if (!weightEl) return;

    const dist = currentRoadDistance;
    const weight = parseFloat(weightEl.value);
    const item = itemEl.value;
    
    let base = 0;
    let weightSurcharge = 0;

    if (selectedService === 'sameday') {
        base = 120;
        if (weight > 1) {
            weightSurcharge = Math.ceil(weight - 1) * 20;
        }
    } else {
        const rates = {
            scheduled: { parcel: [80, 80, 150, 200, 250, 350, 400], cake: [150, 150, 200, 250, 300, 350, 450] },
            instant: { parcel: [100, 120, 160, 185, 220, 240, 300], cake: [160, 170, 210, 230, 260, 280, 350] }
        };

        const distTiers = [3, 6, 9, 15, 24, 30, 99];
        let tierIndex = distTiers.findIndex(t => dist <= t);
        if (tierIndex === -1) tierIndex = distTiers.length - 1;

        base = rates[selectedService][item][tierIndex];

        if (weight > 3) {
            weightSurcharge = Math.ceil(weight - 3) * 20;
        }
    }

    const total = base + weightSurcharge;

    document.getElementById('base-charge').innerText = '৳ ' + base;
    document.getElementById('weight-surcharge').innerText = '৳ ' + weightSurcharge;
    
    const totalEl = document.getElementById('main-total');
    totalEl.innerText = '৳ ' + total;
    
    totalEl.style.transform = 'scale(1.1)';
    setTimeout(() => totalEl.style.transform = 'scale(1)', 200);
}
