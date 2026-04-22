function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Supported formats
const formats = ['png', 'jpg', 'jpeg', 'webp'];

// Try loading image by ID
function loadImageById(id, callback) {
    let loaded = false;

    formats.forEach(format => {
        const img = new Image();
        img.src = `img/${id}.${format}`;

        img.onload = () => {
            if (!loaded) {
                loaded = true;
                callback(img);
            }
        };
    });
}

// 🔍 Search single certificate
function searchCertificate() {
    const id = document.getElementById('searchId').value;
    const result = document.getElementById('result');

    if (!id) {
        result.innerHTML = "<p>Enter a valid ID</p>";
        return;
    }

    loadImageById(id, (img) => {
        result.innerHTML = "";
        img.style.cursor = "pointer";
        img.onclick = () => openModal(parseInt(id)); // Allow clicking on searched item
        result.appendChild(img);
    });

    setTimeout(() => {
        if (!result.innerHTML) {
            result.innerHTML = `<p>No certificate found for ID ${id}</p>`;
        }
    }, 800);
}

// 📦 Auto-load gallery
function loadGallery(max = 50) {
    const grid = document.getElementById('galleryGrid');
    totalImagesLoaded = max; // Keep track of bounds for NEXT button

    for (let i = 1; i <= max; i++) {
        loadImageById(i, (img) => {
            const card = document.createElement('div');
            card.className = "card";
            card.style.cursor = "pointer";
            card.onclick = () => openModal(i); // Open modal on click

            const label = document.createElement('p');
            label.textContent = `ID: ${i}`;

            card.appendChild(img);
            card.appendChild(label);

            grid.appendChild(card);
        });
    }
}

// Load gallery on start
window.onload = () => {
    loadGallery(50); // change limit if needed
};

// 🖼 Fullscreen Image Modal Logic
let currentImageId = null;
let totalImagesLoaded = 50;

function openModal(id) {
    currentImageId = id;
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');

    modal.style.display = "flex";
    modalImg.src = ""; // Clear existing image
    caption.textContent = `Loading ID: ${id}...`;

    loadImageById(id, (img) => {
        // Only update if the user hasn't quickly clicked Next/Prev before loading finished
        if (currentImageId === id) {
            modalImg.src = img.src;
            caption.textContent = `Certificate ID: ${id}`;
        }
    });
}

function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}

function prevImage() {
    if (currentImageId > 1) {
        openModal(currentImageId - 1);
    }
}

function nextImage() {
    if (currentImageId < totalImagesLoaded) {
        openModal(currentImageId + 1);
    }
}