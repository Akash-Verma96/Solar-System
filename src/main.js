import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// initialize pane
// const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// Adding geometry

const sphereGeometry = new THREE.SphereGeometry(1,32,32);

// adding texture loder 

const textureLoder = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/'); 


// Adding textures

const sunTexture = textureLoder.load('/textures/2k_sun.jpg')
sunTexture.colorSpace = THREE.SRGBColorSpace;
const mercuryTexture = textureLoder.load('/textures/2k_mercury.jpg')
mercuryTexture.colorSpace = THREE.SRGBColorSpace;
const venusTexture = textureLoder.load('/textures/2k_venus_surface.jpg')
venusTexture.colorSpace = THREE.SRGBColorSpace;
const earthTexture = textureLoder.load('/textures/2k_earth_daymap.jpg')
earthTexture.colorSpace = THREE.SRGBColorSpace;
const marsTexture = textureLoder.load('/textures/2k_mars.jpg')
marsTexture.colorSpace = THREE.SRGBColorSpace;
const moonTexture = textureLoder.load('/textures/2k_moon.jpg')
moonTexture.colorSpace = THREE.SRGBColorSpace;

// adding background 

const backgroundCubemap = cubeTextureLoader
.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
] );

scene.background = backgroundCubemap;


// adding material
 
const sunMaterial = new THREE.MeshBasicMaterial({
        map:sunTexture})
const mercuryMaterial = new THREE.MeshStandardMaterial({
        map:mercuryTexture})
const venusMaterial = new THREE.MeshStandardMaterial({
        map:venusTexture})
const earthMaterial = new THREE.MeshStandardMaterial({
        map:earthTexture})
const marsMaterial = new THREE.MeshStandardMaterial({
        map:marsTexture})
const moonMaterial = new THREE.MeshStandardMaterial({
        map:moonTexture})



// adding mesh

const sun = new THREE.Mesh(
    sphereGeometry,
    sunMaterial
)
sun.scale.setScalar(5);
scene.add(sun);

// adding planet array

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name:"Jupiter",
    radius:2,
    distance:30,
    speed:0.001,
    material:mercuryMaterial,
    moons:[]
  }
   
];

const createPlanet = (planet)=>{
    // create the mesh
    const planetMesh = new THREE.Mesh(
        sphereGeometry,
        planet.material
    )
    planetMesh.scale.setScalar(planet.radius)
    planetMesh.position.x = planet.distance

    return planetMesh
}

const createMoon = (moon) =>{
    const moonMesh = new THREE.Mesh(
            sphereGeometry,
            moonMaterial
        )
        moonMesh.scale.setScalar(moon.radius)
        moonMesh.position.x = moon.distance

    return moonMesh;
}

const planetMeshes = planets.map((planet)=>{
    const planetMesh = createPlanet(planet);
    // add it to our scene
    scene.add(planetMesh);

    // loop throw moon and create mesh
    planet.moons.forEach((moon)=>{
        const moonMesh = createMoon(moon);

        // add the moon to the planet
        planetMesh.add(moonMesh);
    })

    return planetMesh;
    
})

// adding light

const amibiantLight = new THREE.AmbientLight(0xfffff,0.4)
scene.add(amibiantLight)

const pointLight = new THREE.PointLight(0xffffff,1000)
scene.add(pointLight)



// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// render loop
const renderloop = () => {


  planetMeshes.forEach((planet,planetIndex)=>{
    planet.rotation.y += planets[planetIndex].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance; 
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;

    planet.children.forEach((moon,moonIndex) =>{
        moon.rotation.y += planets[planetIndex].moons[moonIndex].speed
        moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
        moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
    })
  })
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();

