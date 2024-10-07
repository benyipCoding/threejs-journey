import * as THREE from 'three';
import * as dat from 'lil-gui';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ScrollBaseAnimation = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /**
     * Debug
     */
    const gui = new dat.GUI();

    const parameters = {
      materialColor: 'red',
    };

    // gui.addColor(parameters, 'materialColor').onChange(() => {
    //   material.color.set(parameters.materialColor);
    // });

    /**
     * Base
     */
    // Canvas

    // Scene
    const scene = new THREE.Scene();

    /**
     * Texture
     */
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('../assets/3.jpg');
    gradientTexture.magFilter = THREE.NearestFilter;

    /**
     * Objects
     */
    const material = new THREE.MeshNormalMaterial();

    const objectDistance = 4;

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    mesh1.position.y = -objectDistance * 0;
    mesh2.position.y = -objectDistance * 1;
    mesh3.position.y = -objectDistance * 2;

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    scene.add(mesh1, mesh2, mesh3);

    const sectionMeshes = [mesh1, mesh2, mesh3];

    /**
     * Particles
     */
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3 + 0] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] =
        objectDistance * 0.5 -
        Math.random() * objectDistance * sectionMeshes.length;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      depthWrite: false,
      size: 0.03,
    });

    const paricles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(paricles);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Base camera

    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 6;

    cameraGroup.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      alpha: true,
    });
    renderer.setClearAlpha(1);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Scroll
     */
    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;

      const newSection = Math.round(scrollY / sizes.height);
      console.log(sizes.height);

      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5',
        });
      }
    });

    /**
     * Cursor
     */
    const cursor = {
      x: 0,
      y: 0,
    };

    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / sizes.width - 0.5;
      cursor.y = e.clientY / sizes.height - 0.5;
    });

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Animate camera
      camera.position.y = (-scrollY / sizes.height) * objectDistance;

      const parallaxX = cursor.x * 0.5;
      const parallaxY = -cursor.y * 0.5;
      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 4 * deltaTime;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 4 * deltaTime;

      // Animate meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
      }

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <div>
      <canvas
        className="fixed top-0 left-0 outline-none w-[100vw] h-[100vh]"
        ref={canvas}
      ></canvas>

      <section className="z-10 flex items-center h-[100vh] relative text-[#ffeded] uppercase text-[7vmin] pl-[10%] pr-[10%]">
        <h1>My Portfolio</h1>
      </section>
      <section className="z-10 flex items-center h-[100vh] relative text-[#ffeded] uppercase text-[7vmin] pl-[10%] pr-[10%]">
        <h2>My projects</h2>
      </section>
      <section className="z-10 flex items-center h-[100vh] relative text-[#ffeded] uppercase text-[7vmin] pl-[10%] pr-[10%]">
        <h2>Contact me</h2>
      </section>
    </div>
  );
};

export default ScrollBaseAnimation;
