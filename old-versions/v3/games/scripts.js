// Smooth hover/tap effect for mobile
const cards = document.querySelectorAll('.game-card');
cards.forEach(card => {
  card.addEventListener('touchstart', () => {
    card.classList.add('active');
  });
  card.addEventListener('touchend', () => {
    card.classList.remove('active');
  });
});
// Optionally, add more interactive effects here

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
        targetRotation.x = mouse.y * 0.25;
        targetRotation.y = mouse.x * 0.25;
    }
    window.addEventListener('mousemove', onMouseMove);
    // --- Black Hole ---
    const blackHolePosition = new THREE.Vector3(-400, 0, -400);
    const blackHoleVoidRadius = 500;
    const blackHoleGeometry = new THREE.SphereGeometry(80, 128, 128);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHole.position.copy(blackHolePosition);
    scene.add(blackHole);
    // Accretion disk
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
    // --- Starfield ---
    const starTexture = new THREE.TextureLoader().load('https://placehold.co/32x32/FFFFFF/FFFFFF.png');
    const starVertices = [];
    const numStars = 20000;
    for (let i = 0; i < numStars; i++) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500
        );
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
        alphaTest: 0.5,
        blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    // --- Galaxy ---
    const galaxyParticles = 5000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = [];
    const galaxyColors = [];
    const colorInside = new THREE.Color(0xfff5b2);
    const colorOutside = new THREE.Color(0x3d5afe);
    const numArms = 4;
    const armSeparation = (Math.PI * 2) / numArms;
    for (let i = 0; i < galaxyParticles; i++) {
        const radius = Math.random() * 200;
        const arm = i % numArms;
        const angle = arm * armSeparation + radius * 0.15 + Math.random() * 0.2;
        const spin = radius * 0.3;
        const randomX = (Math.random() - 0.5) * 8;
        const randomY = (Math.random() - 0.5) * 8;
        const randomZ = (Math.random() - 0.5) * 8;
        galaxyPositions.push(
            Math.cos(angle + spin) * radius + randomX,
            randomY,
            Math.sin(angle + spin) * radius + randomZ
        );
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
    // --- Shooting Stars ---
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
        scene.rotation.x += (targetRotation.x - scene.rotation.x) * 0.05;
        scene.rotation.y += (targetRotation.y - scene.rotation.y) * 0.05;
        accretionDisk.rotation.z = elapsedTime * 0.2;
        galaxy.rotation.y = elapsedTime * 0.1;
        galaxy.position.x += 0.05;
        galaxy.position.z += 0.02;
        stars.position.z += 0.1;
        if (stars.position.z > 1000) stars.position.z = -1000;
        const positions = shootingStarGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += 8;
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
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
