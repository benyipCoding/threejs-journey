import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import LIL from 'lil-gui';

const Demo2 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  //   const clock = new THREE.Clock();

  const init = () => {
    if (!canvas.current) return;

    //  scene
    const scene = new THREE.Scene();

    //   textures
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    // const matcapTexture = textureLoader.load('/matcaps/3.png');
    const colorTexture = textureLoader.load('/door/color.jpg');
    const aoTexture = textureLoader.load('/door/ambientOcclusion.jpg');
    const doorHeightTexture = textureLoader.load('/door/height.jpg');
    const metalTexture = textureLoader.load('/door/metalness.jpg');
    const roughTexture = textureLoader.load('/door/roughness.jpg');
    const normalTexture = textureLoader.load('/door/normal.jpg');
    const alphaTexture = textureLoader.load('/door/alpha.jpg');
    const environmentTexture = cubeTextureLoader.load([
      '/environmentMaps/3/px.jpg',
      '/environmentMaps/3/nx.jpg',
      '/environmentMaps/3/py.jpg',
      '/environmentMaps/3/ny.jpg',
      '/environmentMaps/3/pz.jpg',
      '/environmentMaps/3/nz.jpg',
    ]);

    // lights
    const ambientLight = new THREE.AmbientLight();
    const pointLight = new THREE.PointLight();
    pointLight.position.set(1, 2, 2);
    pointLight.intensity = 20;
    scene.add(ambientLight);
    scene.add(pointLight);

    //   axis helper
    // const helper = new THREE.AxesHelper();
    // scene.add(helper);

    //   object
    const material = new THREE.MeshStandardMaterial({
      // color: '#f7760d',
    });
    material.metalness = 1;
    material.roughness = 0;
    material.side = THREE.DoubleSide;
    material.envMap = environmentTexture;
    // material.side = THREE.DoubleSide;
    // material.aoMap = aoTexture;
    // material.aoMapIntensity = 1.5;
    // material.displacementMap = doorHeightTexture;
    // material.displacementScale = 0.05;
    // material.metalnessMap = metalTexture;
    // material.roughnessMap = roughTexture;
    // material.normalMap = normalTexture;
    // material.transparent = true;
    // material.alphaMap = alphaTexture;
    // material.envMap = environmentTexture;

    // material.transparent = true;
    // material.matcap = matcapTexture;

    const sphere = new THREE.SphereGeometry(0.5, 64, 64);
    const sphereMesh = new THREE.Mesh(sphere, material);
    sphereMesh.position.set(-1.5, 0, 0);
    sphereMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(sphereMesh.geometry.attributes.uv.array, 2)
    );

    const plane = new THREE.PlaneGeometry(1, 1, 100, 100);
    const planeMesh = new THREE.Mesh(plane, material);
    planeMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array, 2)
    );

    const torus = new THREE.TorusGeometry(0.3, 0.2, 64, 128);
    const torusMesh = new THREE.Mesh(torus, material);
    torusMesh.position.set(1.5, 0, 0);
    torusMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(torusMesh.geometry.attributes.uv.array, 2)
    );

    scene.add(sphereMesh);
    scene.add(planeMesh);
    scene.add(torusMesh);
    //   camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.001,
      1000
    );
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);

    //   controllers
    const controls = new OrbitControls(camera, canvas.current);
    controls.enableDamping = true;

    //   renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);

    const tick = () => {
      requestAnimationFrame(() => {
        tick();
      });
      //   const elapsedTime = clock.getElapsedTime();

      //   sphereMesh.rotation.y = 0.1 * elapsedTime;
      //   planeMesh.rotation.y = 0.1 * elapsedTime;
      //   torusMesh.rotation.y = 0.1 * elapsedTime;

      //   sphereMesh.rotation.x = 0.15 * elapsedTime;
      //   planeMesh.rotation.x = 0.15 * elapsedTime;
      //   torusMesh.rotation.x = 0.15 * elapsedTime;

      controls.update();
      renderer.render(scene, camera);
    };

    // gui
    const gui = new LIL();
    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01);
    gui.add(material, 'wireframe');

    return tick;
  };

  useEffect(() => {
    const tick = init();
    if (!tick) return;
    tick();
  }, []);
  return (
    <div className="h-full">
      <canvas className="w-full h-full" ref={canvas}></canvas>
    </div>
  );
};

export default Demo2;
