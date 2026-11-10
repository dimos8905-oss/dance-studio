// ===================== 3D ELEGANT DANCING FIGURE =====================
var scene, camera, renderer, mainGroup;
var particles = [];
var glowParticles = [];

function init3D() {
    var container = document.getElementById('canvas-3d');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 8);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    mainGroup = new THREE.Group();

    // === ПЛАТФОРМА (сцена) ===
    var platformGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 64);
    var platformMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a2e,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    var platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    mainGroup.add(platform);

    // === КОЛЬЦО-ОРЕОЛ ===
    var haloGeo = new THREE.TorusGeometry(1.8, 0.03, 32, 128);
    var haloMat = new THREE.MeshPhysicalMaterial({
        color: 0xc084fc,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.8,
        metalness: 1.0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
    });
    var halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.5;
    mainGroup.add(halo);

    // === ВТОРОЕ КОЛЬЦО ===
    var halo2 = halo.clone();
    halo2.rotation.x = Math.PI / 2.5;
    halo2.rotation.z = Math.PI / 6;
    halo2.scale.set(0.9, 0.9, 0.9);
    mainGroup.add(halo2);

    // === ТРЕТЬЕ КОЛЬЦО ===
    var halo3 = halo.clone();
    halo3.rotation.x = Math.PI / 3;
    halo3.rotation.z = -Math.PI / 4;
    halo3.scale.set(0.8, 0.8, 0.8);
    mainGroup.add(halo3);

    // === ЦЕНТРАЛЬНАЯ ФИГУРА — Torus Knot (пышное платье) ===
    var dressGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 256, 64, 3, 5);
    var dressMat = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6,
        emissive: 0x3b1f7a,
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
        transparent: true,
        opacity: 0.85,
    });
    var dress = new THREE.Mesh(dressGeo, dressMat);
    dress.position.y = 1.5;
    dress.castShadow = true;
    mainGroup.add(dress);

    // === Wireframe ===
    var wireGeo = new THREE.TorusKnotGeometry(0.82, 0.28, 128, 32, 3, 5);
    var wireMat = new THREE.MeshBasicMaterial({
        color: 0xe9d5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    var wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.y = 1.5;
    mainGroup.add(wireMesh);

    // === ЯДРО ===
    var coreGeo = new THREE.IcosahedronGeometry(0.4, 2);
    var coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xf0abfc,
        emissive: 0xa855f7,
        emissiveIntensity: 1.0,
        metalness: 0.9,
        roughness: 0.05,
        clearcoat: 1.0,
    });
    var core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.5;
    mainGroup.add(core);

    // === ИСКРЫ ===
    var sparkleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    var sparkleMat = new THREE.MeshBasicMaterial({ color: 0xf0abfc });
    
    for (var i = 0; i < 100; i++) {
        var sparkle = new THREE.Mesh(sparkleGeo, sparkleMat.clone());
        var angle = Math.random() * Math.PI * 2;
        var radius = 1.2 + Math.random() * 1.5;
        var height = 0.5 + Math.random() * 2.5;
        sparkle.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        sparkle.userData = {
            angle: angle,
            radius: radius,
            height: height,
            speed: 0.2 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            baseOpacity: 0.3 + Math.random() * 0.7,
        };
        mainGroup.add(sparkle);
        glowParticles.push(sparkle);
    }

    // === СВЕТЯЩИЕСЯ ЛИНИИ ===
    var lineMat = new THREE.LineBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.15,
    });

    for (var li = 0; li < 8; li++) {
        var points = [];
        var angle = (li / 8) * Math.PI * 2;
        var radius = 1.5 + Math.random() * 0.5;
        for (var jj = 0; jj <= 20; jj++) {
            var t = jj / 20;
            var a = angle + t * Math.PI * 2;
            var r = radius + Math.sin(t * Math.PI * 4) * 0.3;
            var y = 0.5 + t * 2.5;
            points.push(new THREE.Vector3(
                Math.cos(a) * r,
                y,
                Math.sin(a) * r
            ));
        }
        var lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(lineGeo, lineMat.clone());
        line.userData = { angle: angle, speed: 0.1 + Math.random() * 0.1 };
        mainGroup.add(line);
        particles.push(line);
    }

    // === ФОНОВЫЕ ЧАСТИЦЫ ===
    var bgGeo = new THREE.BufferGeometry();
    var bgArr = new Float32Array(400);
    for (var bi = 0; bi < 400; bi++) bgArr[bi] = (Math.random() - 0.5) * 20;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgArr, 3));
    mainGroup.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({
        size: 0.01,
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.3,
    })));

    // === ОСВЕЩЕНИЕ ===
    scene.add(new THREE.AmbientLight(0x404040, 0.8));

    var light1 = new THREE.PointLight(0x667eea, 6, 40);
    light1.position.set(5, 5, 5);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 2048;
    light1.shadow.mapSize.height = 2048;
    scene.add(light1);

    var light2 = new THREE.PointLight(0xf093fb, 5, 40);
    light2.position.set(-5, 4, 5);
    scene.add(light2);

    var light3 = new THREE.PointLight(0x4facfe, 4, 40);
    light3.position.set(0, -5, 5);
    scene.add(light3);

    var light4 = new THREE.PointLight(0xc084fc, 3, 30);
    light4.position.set(0, 0, -6);
    scene.add(light4);

    // === ПОЛ ===
    var floorGeo = new THREE.PlaneGeometry(40, 40);
    var floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.3,
        transparent: true,
        opacity: 0.6,
    });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.58;
    floor.receiveShadow = true;
    scene.add(floor);

    // === СВЕЧЕНИЕ ===
    var glowGeo2 = new THREE.CircleGeometry(2.5, 64);
    var glowMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15 });
    var glow = new THREE.Mesh(glowGeo2, glowMat2);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.57;
    mainGroup.add(glow);

    scene.add(mainGroup);

    animate(dress, wireMesh, halo, halo2, halo3, core);
}

function animate(dress, wireMesh, halo, halo2, halo3, core) {
    requestAnimationFrame(function() { animate(dress, wireMesh, halo, halo2, halo3, core); });
    var t = Date.now() * 0.001;

    dress.rotation.y = t * 0.3;
    dress.rotation.x = Math.sin(t * 0.2) * 0.1;
    dress.position.y = 1.5 + Math.sin(t * 0.5) * 0.1;

    wireMesh.rotation.y = -t * 0.4;
    wireMesh.rotation.x = Math.sin(t * 0.3) * 0.15;
    wireMesh.position.y = dress.position.y;

    halo.rotation.z = t * 0.2;
    halo2.rotation.z = -t * 0.15;
    halo3.rotation.z = t * 0.25;

    core.rotation.x = t * 0.5;
    core.rotation.y = t * 0.7;
    core.position.y = dress.position.y;

    glowParticles.forEach(function(p) {
        var d = p.userData;
        d.angle += d.speed * 0.01;
        p.position.x = Math.cos(d.angle) * d.radius;
        p.position.z = Math.sin(d.angle) * d.radius;
        p.position.y = d.height + Math.sin(t * d.speed + d.phase) * 0.2;
        p.material.opacity = d.baseOpacity * (0.5 + 0.5 * Math.sin(t * 2 + d.phase));
    });

    particles.forEach(function(line) {
        line.rotation.y = line.userData.angle + t * line.userData.speed;
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', function() {
    if (!camera || !renderer) return;
    var c = document.getElementById('canvas-3d');
    camera.aspect = c.clientWidth / c.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
});

window.addEventListener('load', init3D);
