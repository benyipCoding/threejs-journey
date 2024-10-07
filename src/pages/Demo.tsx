import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import LIL from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Demo = () => {
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

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: '#a9c388' })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
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

export default Demo;
