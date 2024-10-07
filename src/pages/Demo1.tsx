/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh<
  THREE.SphereGeometry,
  THREE.MeshBasicMaterial,
  THREE.Object3DEventMap
>;
let material: THREE.MeshBasicMaterial;
let texture: THREE.Texture;

const Demo1 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  // sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const initCube = () => {
    if (!canvas.current) return;
    // scene
    const scene = new THREE.Scene();

    // Axes helper
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    // texture
    const textureLoader = new THREE.TextureLoader();
    texture = textureLoader.load('/minecraft.png');
    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    // float32Array
    // const count = 5000;
    // const positionArray = new Float32Array(count * 3 * 3);
    // positionArray.forEach((_, index, arr) => {
    //   arr[index] = (Math.random() - 0.5) * 1;
    // });
    // const positionAttribute = new THREE.BufferAttribute(positionArray, 3);

    // object
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('position', positionAttribute);
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);

    material = new THREE.MeshBasicMaterial({
      wireframe: false,
      map: texture,
    });
    mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0.5, 0.5, 0);
    scene.add(mesh);

    // camera
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    // gsap.to(mesh.position, { duration: 1, x: 2 });
    // camera.position.set(2, 0, 2);

    // controls
    const controls = new OrbitControls(camera, canvas.current);
    controls.enabled = true;
    controls.enableDamping = true;

    // renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // renderer.render(scene, camera);

    // let time = Date.now();
    // const clock = new THREE.Clock();

    const play = () => {
      requestAnimationFrame(() => {
        play();
      });
      // const currentTime = Date.now();
      // const delta = currentTime - time;
      // const passTimeSinceRender = clock.getElapsedTime();
      // time = currentTime;
      // mesh.position.z = Math.sin(passTimeSinceRender);
      // mesh.position.x = Math.cos(passTimeSinceRender);
      // mesh.rotation.y = 1.5 * passTimeSinceRender;
      // mesh.rotation.y += 0.001 * delta;
      // camera.lookAt(mesh.position);
      // camera.position.x = -cursor.x * 4;
      // camera.position.y = cursor.y * 4;
      // camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 3;
      // camera.lookAt(mesh.position);

      // console.log(Math.cos(cursor.x * Math.PI * 2) * 2);
      controls.update();
      renderer.render(scene, camera!);
    };

    return play;
  };

  const onResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const onDblClick = () => {
    const fullscreenEle =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    if (!fullscreenEle) {
      if (canvas.current?.requestFullscreen)
        canvas.current?.requestFullscreen();
      else if (canvas.current?.webkitRequestFullscreen)
        canvas.current.webkitRequestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const guiExample = () => {
    const gui = new GUI();

    const myObject = {
      myBoolean: true,
      myFunction: function () {},
      myString: 'lil-gui',
      myNumber: 1,
      myProperty: 100,
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 1,
          y: mesh.rotation.y + Math.PI * 2,
        });
      },
    };

    gui.add(myObject, 'myBoolean'); // Checkbox
    gui.add(myObject, 'myFunction'); // Button
    gui.add(myObject, 'myString'); // Text Field
    gui.add(myObject, 'myNumber'); // Number Field

    // Add sliders to number fields by passing min and max
    gui.add(myObject, 'myNumber').min(0).max(3).step(0.01);
    gui.add(myObject, 'myNumber', 0, 100, 2); // snap to even numbers

    // Create dropdowns by passing an array or object of named values
    gui.add(myObject, 'myNumber', [0, 1, 2]);
    gui.add(myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 });

    // Chainable methods
    gui
      .add(myObject, 'myProperty')
      .name('Custom Name')
      .onChange((value: any) => {
        console.log(value);
      });

    // Create color pickers for multiple color formats
    // const colorFormats = {
    //   string: '#ffffff',
    //   int: 0xffffff,
    //   object: { r: 1, g: 1, b: 1 },
    //   array: [1, 1, 1],
    // };

    // gui.addColor(material, 'color');
    gui.add(myObject, 'spin');
    // gui.addColor(material.color, 'g');
    // gui.addColor(material.color, 'b');

    gui.addFolder('custom folder');
  };

  // const initTexture = () => {
  //   const image = new Image();
  //   texture = new THREE.Texture(image);
  //   image.onload = () => {
  //     texture.needsUpdate = true;
  //   };
  //   image.src = '/color.jpg';
  // };

  useEffect(() => {
    // initTexture();
    const play = initCube();
    if (!play || !canvas.current) return;
    play();
    window.addEventListener('resize', onResize);
    window.addEventListener('dblclick', onDblClick);
    guiExample();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('dblclick', onDblClick);
    };
  }, []);

  return (
    <div className="h-full">
      <canvas ref={canvas}></canvas>
    </div>
  );
};

export default Demo1;
