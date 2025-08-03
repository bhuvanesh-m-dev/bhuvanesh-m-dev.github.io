document.addEventListener('DOMContentLoaded', () => {

    // --- Guard against no three.js ---
    if (typeof THREE === 'undefined') {
        console.error("THREE.js is not loaded. The 3D background will not work.");
        return;
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#starfield'),
        antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(100);

    // --- Mouse Interaction for Camera Control ---
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        targetRotation.x = mouse.y * 0.25; // Reduced rotation sensitivity
        targetRotation.y = mouse.x * 0.25;
    }
    window.addEventListener('mousemove', onMouseMove);


    // --- Black Hole (Larger, Static, Rotating) ---
    const blackHolePosition = new THREE.Vector3(-400, 0, -400); // Move black hole to the left
    const blackHoleVoidRadius = 500; // The radius of the empty space around the black hole

    // The central black sphere
    const blackHoleGeometry = new THREE.SphereGeometry(80, 128, 128); // Made it much bigger
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHole.position.copy(blackHolePosition);
    scene.add(blackHole);

    // The accretion disk
    const diskParticles = 500;
    const diskGeometry = new THREE.BufferGeometry();
    const diskPositions = [];
    for (let i = 0; i < diskParticles; i++) {
        const radius = 45 + Math.random() * 25;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 3;
        diskPositions.push(x, y, z);
    }
    diskGeometry.setAttribute('position', new THREE.Float32BufferAttribute(diskPositions, 3));
    const diskMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const accretionDisk = new THREE.Points(diskGeometry, diskMaterial);
    accretionDisk.position.copy(blackHolePosition);
    accretionDisk.rotation.x = Math.PI / 2.5;
    accretionDisk.rotation.y = Math.PI / 5;
    scene.add(accretionDisk);


    // --- Starfield (with void around black hole) ---
    // Create a circular texture for round stars
    const starTexture = new THREE.TextureLoader().load('https://placehold.co/32x32/FFFFFF/FFFFFF.png');
    
    const starVertices = [];
    const numStars = 20000;
    for (let i = 0; i < numStars; i++) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500
        );

        // Check if the star is inside the void radius
        if (position.distanceTo(blackHolePosition) > blackHoleVoidRadius) {
            starVertices.push(position.x, position.y, position.z);
        }
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        map: starTexture,
        transparent: true,
        alphaTest: 0.5, // Ensures perfect roundness from texture
        blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);


    // --- Galaxy (White, Violet, Red) ---
    const galaxyParticles = 5000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = [];
    const galaxyColors = [];
    const colorInside = new THREE.Color(0xfff5b2);
    const colorOutside = new THREE.Color(0x3d5afe);

    // Create spiral arms for galaxy-like structure
    const numArms = 4;
    const armSeparation = (Math.PI * 2) / numArms;
    for (let i = 0; i < galaxyParticles; i++) {
        const radius = Math.random() * 200;
        const arm = i % numArms;
        const angle = arm * armSeparation + radius * 0.15 + Math.random() * 0.2; // spiral + spread
        const spin = radius * 0.3;

        // Add some randomness for thickness
        const randomX = (Math.random() - 0.5) * 8;
        const randomY = (Math.random() - 0.5) * 8;
        const randomZ = (Math.random() - 0.5) * 8;

        galaxyPositions.push(
            Math.cos(angle + spin) * radius + randomX,
            randomY,
            Math.sin(angle + spin) * radius + randomZ
        );
    

        // Color interpolation
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 200);
        galaxyColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }
    galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));
    const galaxyMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.position.set(300, -50, -500);
    scene.add(galaxy);

    // --- Animate Galaxy in the animation loop ---
    // Add this inside your animate() function:
    // Animate Galaxy (Wobble & Spin)
    // galaxy.rotation.y = elapsedTime * 0.1; // The main spin
    // galaxy.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2; // The gentle wobble
    // Optionally, you can add more tumbling:
    // galaxy.rotation.z = elapsedTime * 0.05;
    // Optionally, you can move the galaxy a bit:
    // galaxy.position.x += Math.sin(elapsedTime * 0.3) * 0.5;
    // galaxy.position.z += Math.cos(elapsedTime * 0.2) * 0.5;


    // --- Shooting Stars / Comets ---
    const shootingStarGeometry = new THREE.BufferGeometry();
    const shootingStarVertices = [];
    for (let i = 0; i < 50; i++) {
        shootingStarVertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            -Math.random() * 2000
        );
    }
    shootingStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(shootingStarVertices, 3));
    const shootingStarMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.5,
        map: starTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        alphaTest: 0.5,
    });
    const shootingStars = new THREE.Points(shootingStarGeometry, shootingStarMaterial);
    scene.add(shootingStars);


    // --- Animation Loop ---
    const clock = new THREE.Clock();
    function animate() {
        const elapsedTime = clock.getElapsedTime();


        // Smoothly interpolate camera rotation
        scene.rotation.x += (targetRotation.x - scene.rotation.x) * 0.05;
        scene.rotation.y += (targetRotation.y - scene.rotation.y) * 0.05;

        // Rotate Black Hole's Disk
        accretionDisk.rotation.z = elapsedTime * 0.2;

        // Animate Galaxy (Spin & Comet-like movement)
        galaxy.rotation.y = elapsedTime * 0.1; // The main spin
        // Move galaxy slowly in one direction (e.g., along x and z)
        galaxy.position.x += 0.05; // Slow, steady movement in x
        galaxy.position.z += 0.02; // Slow, steady movement in z

        // Animate background stars moving towards the camera
        stars.position.z += 0.1;
        if (stars.position.z > 1000) stars.position.z = -1000;

        // Animate shooting stars
        const positions = shootingStarGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += 8; // Move much faster
            if (positions[i + 2] > camera.position.z) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = (Math.random() - 0.5) * 2000;
                positions[i + 2] = -2000;
            }
        }
        shootingStarGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // --- Window Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // --- UI Logic (unchanged) ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent! Thank you for reaching out.');
        contactForm.reset();
    });
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

