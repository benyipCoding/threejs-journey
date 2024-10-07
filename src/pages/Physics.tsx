import { useEffect, useRef } from 'react';
import * as dat from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const gui = new dat.GUI();

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  '../assets/textures/environmentMaps/0/px.png',
  '../assets/textures/environmentMaps/0/nx.png',
  '../assets/textures/environmentMaps/0/py.png',
  '../assets/textures/environmentMaps/0/ny.png',
  '../assets/textures/environmentMaps/0/pz.png',
  '../assets/textures/environmentMaps/0/nz.png',
]);

const scene = new THREE.Scene();

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

const Physics = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Create sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  });

  const createSphere = (radius: number, position: THREE.Vector3Like) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.castShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.copy(position);
    scene.add(mesh);
  };

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  });

  const createBox = (
    width: number,
    height: number,
    depth: number,
    position: THREE.Vector3Like
  ) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);
  };

  const debugObject = {
    createSphere: () => {
      createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    },

    createBox: () => {
      createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    },
  };

  useEffect(() => {
    // Controls
    const controls = new OrbitControls(camera, canvas.current!);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resizeHandler = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', resizeHandler);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  gui.add(debugObject, 'createSphere');
  gui.add(debugObject, 'createBox');

  return (
    <canvas
      className="fixed top-0 left-0 outline-none w-full h-full"
      ref={canvas}
    ></canvas>
  );
};

export default Physics;
