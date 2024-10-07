import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import LIL from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const HauntedHouse = () => {
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
    // const textureLoader = new THREE.TextureLoader();

    /**
     * House
     */
    const house = new THREE.Group();
    scene.add(house);

    //   walls
    const wallHeight = 2.5;
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, wallHeight, 4),
      new THREE.MeshStandardMaterial({ color: '#ac8e82' })
    );

    walls.position.y = wallHeight * 0.5;
    house.add(walls);

    /**
     * roof
     */
    const roofHeight = 1;
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, roofHeight, 4),
      new THREE.MeshStandardMaterial({ color: '#b35f45' })
    );
    roof.position.y = wallHeight + roofHeight * 0.5;
    roof.rotation.y = Math.PI * 0.25;
    house.add(roof);

    /**
     * door
     */
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
    );
    door.position.y = 1;
    door.position.z = 2 + 0.01;

    house.add(door);

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
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.7);
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

export default HauntedHouse;
