import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { update } from 'three/examples/jsm/libs/tween.module.js';
import { color } from 'three/examples/jsm/nodes/Nodes.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5, false);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const directionallight = new THREE.DirectionalLight(0xffffff, 10.0);
directionallight.position.set(0, 1, 1);
scene.add(directionallight);

const geometory = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometory, material);
// scene.add(cube);

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const customTexture = textureLoader.load('private/just_a_girl/textures/lambert7SG_baseColor.png');
let loadmodel;
let animmixer;
let basecolor = new THREE.Color("rgb(255, 100, 0)");
let emissivecolor = new THREE.Color("rgb(255, 255, 255)");
let emissiveIntensityvalue = 0;
loader.load('/private/test.glb',
    function (gltf) {
        loadmodel = gltf.scene;
        console.log(loadmodel);
        loadmodel.scale.set(1, 1, 1);
        loadmodel.position.set(0, -2, 0);
        scene.add(loadmodel);
        function materialanim() {
            requestAnimationFrame(materialanim);
            loadmodel.traverse(function (object) {
                if (object.isMesh && object.material) {
                    const custommaterial = new THREE.MeshStandardMaterial({
                        color: basecolor,
                        emissive: emissivecolor,
                        emissiveIntensity: emissiveIntensityvalue,
                    });
                    object.material = custommaterial;
                    //object.material.map = customTexture;
                    object.material.needsUpdate = true;
                }
                emissiveIntensityvalue += 0.01;
                if (emissiveIntensityvalue >= 1) {
                    emissiveIntensityvalue = 0;
                }
            });
        }
        materialanim();
        animmixer = new THREE.AnimationMixer(loadmodel);
        if (gltf.animations.length > 0) {
            const action = animmixer.clipAction(gltf.animations[0]);
            action.play();
        }
    }, function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); }, function (error) { console.error(error); console.error('An error happened:', error); });
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (animmixer) {
        animmixer.update(delta);
    }
    if (loadmodel != null) {
        loadmodel.rotation.y += 0.01;
    }
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable() || WebGL.isWebGL2Available()) {
    animate();
} else if (WebGL.isWebGLAvailable() == false) {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
} else if (WebGL.isWebGL2Available() == false) {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}
