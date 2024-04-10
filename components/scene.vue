<template>
  <canvas id="canvas" class="absolute inset-0 z-[-1] opacity-0" />
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

const parameters = {
  elevation: 0.1,
  exposure: 0.5,
  azimuth: 180,
};
let onUnmount: () => void;

onMounted(async () => {
  let unmounted = false;

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer;
  let water: Water, sun: THREE.Vector3, mesh: THREE.Mesh;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = parameters.exposure;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    camera.position.set(30, 30, 100);

    //

    sun = new THREE.Vector3();

    // Water

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: "0xffffff",
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 0.1;
    skyUniforms["rayleigh"].value = 4;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sceneEnv = new THREE.Scene();

    let renderTarget: THREE.WebGLRenderTarget;

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();

      if (renderTarget !== undefined) renderTarget.dispose();

      sceneEnv.add(sky);
      renderTarget = pmremGenerator.fromScene(sceneEnv);
      scene.add(sky);

      scene.environment = renderTarget.texture;
    }

    updateSun();
    //

    const geometry = new THREE.SphereGeometry(15);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.5 });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener("resize", onWindowResize);

    return {
      setExposure: (v: number) => {
        parameters.exposure = v;
        renderer.toneMappingExposure = v;
      },
      setSun: (elevation: number, rayleigh: number) => {
        skyUniforms["rayleigh"].value = rayleigh;
        parameters.elevation = elevation;

        updateSun();
      },
    };
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let opacity = 0;
  const { setExposure, setSun } = init();

  function animate() {
    if (unmounted) return;
    if (opacity < 100) canvas.style.setProperty("opacity", `${opacity++}%`);

    const time = performance.now() * 0.001;
    mesh.position.y = Math.sin(time) * 4;

    setExposure(0.2);
    setSun(-90, -2);

    water.material.uniforms["time"].value += 1.0 / 60.0;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();

  onUnmount = () => {
    unmounted = true;
    window.removeEventListener("resize", onWindowResize);
  };
});

onUnmounted(() => {
  onUnmount();
});
</script>
