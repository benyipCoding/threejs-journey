import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import LIL from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Particles = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const gui = new LIL();
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const init = () => {
    // Scene
    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/textures/particles/2.png');

    /**
     * particles
     */
    // const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const count = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3)
    );

    const particleMaterial = new THREE.PointsMaterial();

    particleMaterial.size = 0.1;
    particleMaterial.sizeAttenuation = true;

    particleMaterial.color = new THREE.Color('#ff88cc');
    particleMaterial.transparent = true;

    particleMaterial.alphaMap = particleTexture;
    particleMaterial.alphaTest = 0.01;
    particleMaterial.depthTest = false;

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 20);
    gui.add(ambientLight, 'intensity').min(0).max(100).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#ffffff', 4);
    moonLight.position.set(4, 5, -2);
    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
    scene.add(moonLight);

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
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas.current!);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    // const clock = new THREE.Clock();

    const tick = () => {
      //   const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    return tick;
  };

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

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    const tick = init();
    if (!tick) return;
    tick();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className="h-full">
      <canvas className="size-full" ref={canvas}></canvas>
    </div>
  );
};

export default Particles;
