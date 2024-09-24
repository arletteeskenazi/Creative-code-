// Crear la escena, cámara y renderizador
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agregar una luz a la escena
var ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 1, 100); // Luz puntual
pointLight.position.set(10, 10, 10); // Posición de la luz
scene.add(pointLight);

// Cargar la fuente para el texto 3D
var loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    var textGeometry = new THREE.TextGeometry('Arteske', {
        font: font,
        size: 6,  // Tamaño del texto
        height: 1, // Profundidad del texto
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1, // Grosor del bisel
        bevelSize: 0.1, // Tamaño del bisel
        bevelOffset: 0,
        bevelSegments: 5
    });

    var textMaterial = new THREE.MeshPhongMaterial({ color: 0x630F0F, shininess: 100 }); // Color rojo cereza con brillo
    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center(); // Centrar el texto en la pantalla
    scene.add(textMesh);

    // Posicionar la cámara
    camera.position.z = 20;

    // Crear fuegos artificiales
    var particles = [];
    var particleCount = 200; // Cantidad de partículas

    function createFirework() {
        var fireworkParticles = [];
        for (let i = 0; i < particleCount; i++) {
            var particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
            var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8 });
            var particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Posición inicial del fuego artificial
            particle.position.set(0, 0, 0);
            scene.add(particle);
            fireworkParticles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 4, // Velocidad aleatoria en x
                    (Math.random() - 0.5) * 4 + 2, // Velocidad en y, asegurando que vaya hacia arriba
                    (Math.random() - 0.5) * 4 // Velocidad aleatoria en z
                ),
                life: Math.random() * 2 + 1 // Vida de la partícula
            });
        }
        return fireworkParticles;
    }

    // Función para actualizar los fuegos artificiales
    function updateFireworks(fireworkParticles) {
        fireworkParticles.forEach((particle) => {
            particle.mesh.position.add(particle.velocity); // Actualiza la posición según la velocidad
            particle.life -= 0.02; // Disminuye la vida de la partícula

            // Desaparece si la vida ha terminado
            if (particle.life <= 0) {
                particle.mesh.visible = false;
            }
        });
    }

    // Animar el texto y los fuegos artificiales
    var fireworks = [];
    function animate() {
        requestAnimationFrame(animate);

        // Rotación del texto
        textMesh.rotation.x += 0.05;
        textMesh.rotation.y += 0.05;

        // Generar nuevos fuegos artificiales de forma periódica
        if (Math.random() < 0.05) {
            fireworks.push(createFirework());
        }

        // Actualizar fuegos artificiales
        fireworks.forEach((fireworkParticles) => {
            updateFireworks(fireworkParticles);
        });

        renderer.render(scene, camera);
    }

    animate();
});

// Ajustar la ventana al cambiar el tamaño
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
