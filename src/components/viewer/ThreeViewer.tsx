import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ViewerLayers,
  ViewerTool,
  MeasurementRecord,
  MeasurementPoint,
  Project,
} from '../../types';

export interface ThreeViewerRef {
  getScene: () => THREE.Scene | null;
  getCanvas: () => HTMLCanvasElement | null;
  resetCamera: () => void;
  setCameraPreset: (preset: 'perspective' | 'top' | 'side' | 'drone') => void;
}

interface ThreeViewerProps {
  project: Project;
  layers: ViewerLayers;
  activeTool: ViewerTool;
  onAddMeasurement: (record: MeasurementRecord) => void;
  onSelectObject: (info: { name: string; type: string; height?: string; area?: string; coords?: string } | null) => void;
  measurements: MeasurementRecord[];
}

export const ThreeViewer = forwardRef<ThreeViewerRef, ThreeViewerProps>(({
  project,
  layers,
  activeTool,
  onAddMeasurement,
  onSelectObject,
  measurements,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Scene group references for layer toggles
  const terrainGroupRef = useRef<THREE.Group>(new THREE.Group());
  const buildingsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const roadsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const vegetationGroupRef = useRef<THREE.Group>(new THREE.Group());
  const infrastructureGroupRef = useRef<THREE.Group>(new THREE.Group());
  const pointCloudGroupRef = useRef<THREE.Group>(new THREE.Group());
  const gpsTrackGroupRef = useRef<THREE.Group>(new THREE.Group());
  const measurementGroupRef = useRef<THREE.Group>(new THREE.Group());
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Active measurement interaction state
  const pendingPointsRef = useRef<THREE.Vector3[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getScene: () => sceneRef.current,
    getCanvas: () => canvasRef.current,
    resetCamera: () => {
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(45, 38, 55);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    },
    setCameraPreset: (preset) => {
      if (!cameraRef.current || !controlsRef.current) return;
      if (preset === 'top') {
        cameraRef.current.position.set(0, 75, 0.01);
        controlsRef.current.target.set(0, 0, 0);
      } else if (preset === 'side') {
        cameraRef.current.position.set(70, 10, 0);
        controlsRef.current.target.set(0, 5, 0);
      } else if (preset === 'drone') {
        cameraRef.current.position.set(-30, 48, -35);
        controlsRef.current.target.set(5, 5, 5);
      } else {
        cameraRef.current.position.set(45, 38, 55);
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    },
  }));

  // Initial Scene Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(45, 38, 55);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 5;
    controls.maxDistance = 250;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.4);
    scene.add(hemiLight);

    // 6. Grid Helper
    const grid = new THREE.GridHelper(120, 60, 0x00e5ff, 0x1e293b);
    grid.position.y = -0.02;
    grid.name = 'groundGrid';
    scene.add(grid);
    gridHelperRef.current = grid;

    // 7. Add Groups to Scene
    scene.add(terrainGroupRef.current);
    scene.add(buildingsGroupRef.current);
    scene.add(roadsGroupRef.current);
    scene.add(vegetationGroupRef.current);
    scene.add(infrastructureGroupRef.current);
    scene.add(pointCloudGroupRef.current);
    scene.add(gpsTrackGroupRef.current);
    scene.add(measurementGroupRef.current);

    // 8. Build Procedural Realistic Survey Scene
    buildProceduralScene();

    // 9. Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      // Drone flight marker slight hover animation
      const droneMarker = gpsTrackGroupRef.current.getObjectByName('droneMarker');
      if (droneMarker) {
        const time = Date.now() * 0.001;
        droneMarker.position.y = 42 + Math.sin(time * 2) * 0.4;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Layers Visibility when `layers` prop changes
  useEffect(() => {
    terrainGroupRef.current.visible = layers.terrain;
    buildingsGroupRef.current.visible = layers.buildings;
    roadsGroupRef.current.visible = layers.roads;
    vegetationGroupRef.current.visible = layers.vegetation;
    infrastructureGroupRef.current.visible = layers.infrastructure;
    pointCloudGroupRef.current.visible = layers.pointCloud;
    gpsTrackGroupRef.current.visible = layers.gpsTrack;

    if (gridHelperRef.current) {
      gridHelperRef.current.visible = layers.grid;
    }

    // Toggle wireframe on building & terrain meshes
    const updateWireframe = (group: THREE.Group) => {
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              if ('wireframe' in m) {
                (m as any).wireframe = layers.wireframe;
              }
            });
          } else if (mesh.material && 'wireframe' in mesh.material) {
            (mesh.material as any).wireframe = layers.wireframe;
          }
        }
      });
    };

    updateWireframe(terrainGroupRef.current);
    updateWireframe(buildingsGroupRef.current);
    updateWireframe(infrastructureGroupRef.current);
  }, [layers]);

  // Redraw Measurement Records in 3D
  useEffect(() => {
    const group = measurementGroupRef.current;
    group.clear();

    measurements.forEach((record) => {
      const color = new THREE.Color(record.color || 0x00e5ff);

      if (record.type === 'distance' && record.points.length >= 2) {
        const p1 = new THREE.Vector3(record.points[0].x, record.points[0].y + 0.1, record.points[0].z);
        const p2 = new THREE.Vector3(record.points[1].x, record.points[1].y + 0.1, record.points[1].z);

        // Dashed glowing line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineDashedMaterial({
          color: color,
          dashSize: 1,
          gapSize: 0.5,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        group.add(line);

        // Endpoint sphere markers
        const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: color });
        const m1 = new THREE.Mesh(sphereGeo, sphereMat);
        m1.position.copy(p1);
        const m2 = new THREE.Mesh(sphereGeo, sphereMat);
        m2.position.copy(p2);
        group.add(m1, m2);
      } else if (record.type === 'height' && record.points.length >= 2) {
        const p1 = new THREE.Vector3(record.points[0].x, record.points[0].y, record.points[0].z);
        const p2 = new THREE.Vector3(record.points[1].x, record.points[1].y, record.points[1].z);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
        group.add(new THREE.Line(lineGeo, lineMat));

        const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const m1 = new THREE.Mesh(sphereGeo, sphereMat);
        m1.position.copy(p1);
        const m2 = new THREE.Mesh(sphereGeo, sphereMat);
        m2.position.copy(p2);
        group.add(m1, m2);
      }
    });
  }, [measurements]);

  // Procedural Scene Generator
  const buildProceduralScene = () => {
    // Clear existing
    terrainGroupRef.current.clear();
    buildingsGroupRef.current.clear();
    roadsGroupRef.current.clear();
    vegetationGroupRef.current.clear();
    infrastructureGroupRef.current.clear();
    pointCloudGroupRef.current.clear();
    gpsTrackGroupRef.current.clear();

    // 1. Terrain Mesh (Realistic undulating topography with elevation contours)
    const terrainWidth = 100;
    const terrainHeight = 100;
    const segments = 60;
    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Gentle slope + localized hills
      const distFromCenter = Math.sqrt(x * x + z * z);
      let y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.2 - (z * 0.04);
      if (distFromCenter < 25) {
        y *= 0.3; // Flatten central urban corridor
      }
      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.name = 'Terrain Ground Surface';
    terrainGroupRef.current.add(terrainMesh);

    // 2. Road Network (Corridor spine and cross avenues)
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.7,
      metalness: 0.2,
    });

    // Main Avenue
    const mainRoadGeo = new THREE.PlaneGeometry(10, 94);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.position.set(0, 0.04, 0);
    mainRoad.receiveShadow = true;
    mainRoad.name = 'Primary Arterial Road Corridor';
    roadsGroupRef.current.add(mainRoad);

    // Cross Street 1
    const crossRoad1Geo = new THREE.PlaneGeometry(76, 7);
    crossRoad1Geo.rotateX(-Math.PI / 2);
    const crossRoad1 = new THREE.Mesh(crossRoad1Geo, roadMat);
    crossRoad1.position.set(0, 0.05, -18);
    crossRoad1.receiveShadow = true;
    crossRoad1.name = 'Commercial Cross Avenue';
    roadsGroupRef.current.add(crossRoad1);

    // Cross Street 2
    const crossRoad2Geo = new THREE.PlaneGeometry(68, 6);
    crossRoad2Geo.rotateX(-Math.PI / 2);
    const crossRoad2 = new THREE.Mesh(crossRoad2Geo, roadMat);
    crossRoad2.position.set(0, 0.05, 20);
    crossRoad2.receiveShadow = true;
    crossRoad2.name = 'South Perimeter Access Road';
    roadsGroupRef.current.add(crossRoad2);

    // Road Divider Center Line (Glowing yellow dashes)
    const dividerGeo = new THREE.PlaneGeometry(0.4, 90);
    dividerGeo.rotateX(-Math.PI / 2);
    const dividerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const divider = new THREE.Mesh(dividerGeo, dividerMat);
    divider.position.set(0, 0.06, 0);
    roadsGroupRef.current.add(divider);

    // 3. Buildings (17 distinct structures with realistic facades & roofs)
    const buildingMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.3 }), // Modern concrete
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6, metalness: 0.2 }), // Gray block
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.5 }), // Glass/steel facade
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.4 }), // Cyan modern
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.1 }), // Civic stone
    ];

    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const hvacMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });

    // 17 Realistically positioned buildings
    const buildingConfigs = [
      // West Block
      { x: -14, z: -30, w: 10, d: 12, h: 18, name: 'Municipal Complex North' },
      { x: -15, z: -10, w: 9, d: 8, h: 12, name: 'Commercial Hub A' },
      { x: -13, z: 6, w: 8, d: 10, h: 15, name: 'Metro Gateway Tower' },
      { x: -15, z: 28, w: 11, d: 9, h: 9, name: 'Logistics Facility 01' },
      { x: -28, z: -25, w: 12, d: 14, h: 8, name: 'Industrial Warehouse West' },
      { x: -27, z: -2, w: 10, d: 10, h: 22, name: 'Financial Center High-Rise' },
      { x: -28, z: 18, w: 8, d: 12, h: 14, name: 'Tech Park Annex' },
      { x: -26, z: 32, w: 9, d: 7, h: 7, name: 'Substation Control Room' },

      // East Block
      { x: 14, z: -32, w: 11, d: 9, h: 16, name: 'Government Data Center' },
      { x: 13, z: -12, w: 8, d: 11, h: 14, name: 'Retail Arcade Sector 4' },
      { x: 15, z: 4, w: 10, d: 8, h: 20, name: 'Urban Smart Tower' },
      { x: 14, z: 24, w: 9, d: 12, h: 11, name: 'Health Sciences Wing' },
      { x: 26, z: -28, w: 10, d: 8, h: 13, name: 'Residency Block A' },
      { x: 27, z: -8, w: 12, d: 12, h: 19, name: 'Corporate Headquarters' },
      { x: 25, z: 12, w: 8, d: 9, h: 10, name: 'Community Center' },
      { x: 28, z: 28, w: 11, d: 10, h: 15, name: 'Public Transit Terminal' },
      { x: 0, z: -40, w: 14, d: 6, h: 6, name: 'North Tollway Plaza' },
    ];

    buildingConfigs.forEach((cfg, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(cfg.x, 0, cfg.z);

      // Main structure
      const mat = buildingMaterials[idx % buildingMaterials.length];
      const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      geo.translate(0, cfg.h / 2, 0);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = cfg.name;
      mesh.userData = {
        name: cfg.name,
        type: 'Building Structure',
        height: `${cfg.h.toFixed(1)} m`,
        area: `${(cfg.w * cfg.d).toFixed(0)} m²`,
        coords: `26.912${4 + idx}°N, 75.787${3 + idx}°E`,
      };
      bGroup.add(mesh);

      // Rooftop parapet & HVAC units
      const hvacGeo = new THREE.BoxGeometry(cfg.w * 0.35, 1.2, cfg.d * 0.3);
      hvacGeo.translate(0, cfg.h + 0.6, 0);
      const hvac = new THREE.Mesh(hvacGeo, hvacMat);
      hvac.castShadow = true;
      bGroup.add(hvac);

      // Rooftop water tank or solar array on some buildings
      if (idx % 3 === 0) {
        const solarGeo = new THREE.BoxGeometry(cfg.w * 0.6, 0.2, cfg.d * 0.5);
        solarGeo.translate(0, cfg.h + 0.3, 0);
        const solarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
        const solar = new THREE.Mesh(solarGeo, solarMat);
        bGroup.add(solar);
      }

      buildingsGroupRef.current.add(bGroup);
    });

    // 4. Elevated Bridge / Overpass Ramp Structure
    const bridgeGroup = new THREE.Group();
    const deckGeo = new THREE.BoxGeometry(8, 0.8, 36);
    deckGeo.translate(0, 5, 0);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(-2, 0, 38);
    deck.castShadow = true;
    deck.name = 'Elevated Highway Overpass Ramp';
    deck.userData = {
      name: 'Highway Overpass Span A',
      type: 'Infrastructure Structure',
      height: '5.8 m',
      area: '288 m²',
      coords: '26.9138°N, 75.7891°E',
    };
    bridgeGroup.add(deck);

    // Bridge Support Columns
    for (let p = -12; p <= 12; p += 8) {
      const colGeo = new THREE.CylinderGeometry(0.7, 0.7, 5, 12);
      colGeo.translate(0, 2.5, 0);
      const col = new THREE.Mesh(colGeo, deckMat);
      col.position.set(-2, 0, 38 + p);
      col.castShadow = true;
      bridgeGroup.add(col);
    }
    infrastructureGroupRef.current.add(bridgeGroup);

    // 5. Communications / Telecom Tower
    const towerGroup = new THREE.Group();
    towerGroup.position.set(32, 0, -22);
    const towerBaseGeo = new THREE.CylinderGeometry(0.4, 1.8, 28, 4);
    towerBaseGeo.translate(0, 14, 0);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.3 });
    const tower = new THREE.Mesh(towerBaseGeo, towerMat);
    tower.castShadow = true;
    tower.name = 'Telecommunications Lattice Tower';
    tower.userData = {
      name: 'Cellular Lattice Mast #09',
      type: 'Telecommunications Asset',
      height: '28.6 m',
      area: '16 m²',
      coords: '26.9142°N, 75.7865°E',
    };
    towerGroup.add(tower);

    // Beacon light on tower top
    const beaconGeo = new THREE.SphereGeometry(0.5, 8, 8);
    beaconGeo.translate(0, 28.2, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    towerGroup.add(new THREE.Mesh(beaconGeo, beaconMat));
    infrastructureGroupRef.current.add(towerGroup);

    // 6. Vegetation & Trees (Scattered realistic foliage along park perimeter)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 6);
    treeTrunkGeo.translate(0, 1, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b3a29 });

    const treeFoliageGeo = new THREE.DodecahedronGeometry(1.5, 1);
    treeFoliageGeo.translate(0, 2.8, 0);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

    const treePositions = [
      { x: -5, z: -25 }, { x: -6, z: -15 }, { x: -5, z: 12 }, { x: -6, z: 25 },
      { x: 5, z: -28 }, { x: 6, z: -10 }, { x: 5, z: 15 }, { x: 6, z: 30 },
      { x: -35, z: -10 }, { x: -33, z: 5 }, { x: -36, z: 18 },
      { x: 33, z: -20 }, { x: 35, z: 0 }, { x: 36, z: 15 },
    ];

    treePositions.forEach((pos) => {
      const tree = new THREE.Group();
      tree.position.set(pos.x, 0, pos.z);
      const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
      trunk.castShadow = true;
      const foliage = new THREE.Mesh(treeFoliageGeo, foliageMat);
      foliage.castShadow = true;
      tree.add(trunk, foliage);
      vegetationGroupRef.current.add(tree);
    });

    // 7. Dense Photogrammetric Point Cloud (Thousands of color-coded points)
    const pointCount = 14000;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      let x = (Math.random() - 0.5) * 85;
      let z = (Math.random() - 0.5) * 85;
      let y = 0;

      // Cluster points on buildings or terrain
      const nearBld = buildingConfigs[i % buildingConfigs.length];
      if (Math.random() > 0.4 && nearBld) {
        x = nearBld.x + (Math.random() - 0.5) * nearBld.w * 1.1;
        z = nearBld.z + (Math.random() - 0.5) * nearBld.d * 1.1;
        y = Math.random() * nearBld.h;
      } else {
        y = Math.sin(x * 0.05) * 1.5;
      }

      pointPositions[i * 3] = x;
      pointPositions[i * 3 + 1] = y;
      pointPositions[i * 3 + 2] = z;

      // Color based on elevation (spatial gradient: blue -> cyan -> yellow -> red)
      const normY = Math.max(0, Math.min(1, y / 24));
      pointColors[i * 3] = normY * 0.9;
      pointColors[i * 3 + 1] = 0.5 + (1 - normY) * 0.5;
      pointColors[i * 3 + 2] = 1 - normY * 0.7;
    }

    const pointCloudGeo = new THREE.BufferGeometry();
    pointCloudGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointCloudGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointCloudMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const pointCloud = new THREE.Points(pointCloudGeo, pointCloudMat);
    pointCloud.name = 'Photogrammetric Dense Point Cloud';
    pointCloudGroupRef.current.add(pointCloud);

    // 8. Single-Pass Drone Flight Path (Glowing 3D GPS trajectory spline & camera frustums)
    const flightPoints = [
      new THREE.Vector3(0, 42, -50),
      new THREE.Vector3(-4, 42, -30),
      new THREE.Vector3(2, 42, -10),
      new THREE.Vector3(-2, 42, 10),
      new THREE.Vector3(3, 42, 30),
      new THREE.Vector3(0, 42, 50),
    ];

    const curve = new THREE.CatmullRomCurve3(flightPoints);
    const splinePoints = curve.getPoints(80);
    const splineGeo = new THREE.BufferGeometry().setFromPoints(splinePoints);
    const splineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 3 });
    const flightLine = new THREE.Line(splineGeo, splineMat);
    gpsTrackGroupRef.current.add(flightLine);

    // Camera Waypoint Frustums along trajectory
    splinePoints.forEach((pt, i) => {
      if (i % 12 === 0) {
        // Pyramidal camera field of view cone pointing down
        const frustumGeo = new THREE.ConeGeometry(3, 8, 4);
        frustumGeo.rotateX(Math.PI);
        const frustumMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        const frustum = new THREE.Mesh(frustumGeo, frustumMat);
        frustum.position.set(pt.x, pt.y - 4, pt.z);
        gpsTrackGroupRef.current.add(frustum);

        // Waypoint pin
        const pinGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.copy(pt);
        gpsTrackGroupRef.current.add(pin);
      }
    });

    // Drone Marker indicator at active position
    const droneMarkerGroup = new THREE.Group();
    droneMarkerGroup.name = 'droneMarker';
    droneMarkerGroup.position.set(0, 42, 0);

    const bodyGeo = new THREE.BoxGeometry(1.6, 0.3, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const droneBody = new THREE.Mesh(bodyGeo, bodyMat);
    droneMarkerGroup.add(droneBody);

    // Glowing rotor LEDs
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    [[-0.9, -0.9], [-0.9, 0.9], [0.9, -0.9], [0.9, 0.9]].forEach(([lx, lz]) => {
      const led = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 8), ledMat);
      led.position.set(lx, 0.2, lz);
      droneMarkerGroup.add(led);
    });

    gpsTrackGroupRef.current.add(droneMarkerGroup);
  };

  // Interactive Click Raycaster for Measurements and Inspection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Targets: buildings, terrain, infrastructure
    const interactables: THREE.Object3D[] = [];
    buildingsGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) interactables.push(child);
    });
    terrainGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) interactables.push(child);
    });
    infrastructureGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) interactables.push(child);
    });

    const intersects = raycaster.intersectObjects(interactables, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const pt = hit.point;

      if (activeTool === 'select') {
        const data = hit.object.userData;
        if (data && data.name && data.type) {
          onSelectObject({
            name: data.name,
            type: data.type,
            height: data.height,
            area: data.area,
            coords: data.coords,
          });
        } else {
          onSelectObject({
            name: hit.object.name || 'Terrain Surface Point',
            type: 'Topographic Coordinate',
            height: `${pt.y.toFixed(2)} m MSL`,
            coords: `X: ${pt.x.toFixed(2)}m, Z: ${pt.z.toFixed(2)}m`,
          });
        }
      } else if (activeTool === 'distance') {
        const points = [...pendingPointsRef.current, pt];
        pendingPointsRef.current = points;

        if (points.length === 2) {
          const dist = points[0].distanceTo(points[1]);
          const newMeasurement: MeasurementRecord = {
            id: Date.now().toString(),
            type: 'distance',
            points: [
              { x: points[0].x, y: points[0].y, z: points[0].z },
              { x: points[1].x, y: points[1].y, z: points[1].z },
            ],
            value: dist,
            unit: 'm',
            label: `Distance M${measurements.length + 1}`,
            color: '#00e5ff',
            timestamp: new Date().toLocaleTimeString(),
          };
          onAddMeasurement(newMeasurement);
          pendingPointsRef.current = [];
        }
        setClickCount((c) => c + 1);
      } else if (activeTool === 'height') {
        const points = [...pendingPointsRef.current, pt];
        pendingPointsRef.current = points;

        if (points.length === 2) {
          const heightDiff = Math.abs(points[1].y - points[0].y);
          const newMeasurement: MeasurementRecord = {
            id: Date.now().toString(),
            type: 'height',
            points: [
              { x: points[0].x, y: points[0].y, z: points[0].z },
              { x: points[1].x, y: points[1].y, z: points[1].z },
            ],
            value: Math.max(heightDiff, 1.2), // Minimum sensible height
            unit: 'm',
            label: `Building Height M${measurements.length + 1}`,
            color: '#f59e0b',
            timestamp: new Date().toLocaleTimeString(),
          };
          onAddMeasurement(newMeasurement);
          pendingPointsRef.current = [];
        }
        setClickCount((c) => c + 1);
      } else if (activeTool === 'area') {
        const points = [...pendingPointsRef.current, pt];
        pendingPointsRef.current = points;

        if (points.length === 3) {
          // Compute triangle area
          const vA = new THREE.Vector3().subVectors(points[1], points[0]);
          const vB = new THREE.Vector3().subVectors(points[2], points[0]);
          const area = new THREE.Vector3().crossVectors(vA, vB).length() * 0.5 * 25; // scaled to realistic ground m²
          const newMeasurement: MeasurementRecord = {
            id: Date.now().toString(),
            type: 'area',
            points: points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
            value: area,
            unit: 'm²',
            label: `Area Polygon M${measurements.length + 1}`,
            color: '#10b981',
            timestamp: new Date().toLocaleTimeString(),
          };
          onAddMeasurement(newMeasurement);
          pendingPointsRef.current = [];
        }
        setClickCount((c) => c + 1);
      } else if (activeTool === 'marker') {
        const newMeasurement: MeasurementRecord = {
          id: Date.now().toString(),
          type: 'distance',
          points: [{ x: pt.x, y: pt.y, z: pt.z }],
          value: pt.y,
          unit: 'm MSL',
          label: `Survey Marker ${measurements.length + 1}`,
          color: '#ec4899',
          timestamp: new Date().toLocaleTimeString(),
        };
        onAddMeasurement(newMeasurement);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0e17] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Dynamic 3D Interaction Hint Badge */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-300 font-medium">Tool:</span>
          <span className="text-cyan-300 uppercase font-mono font-bold tracking-wide">
            {activeTool}
          </span>
          {activeTool !== 'select' && (
            <span className="text-slate-400 text-[10px] border-l border-white/10 pl-2">
              {activeTool === 'distance' && (pendingPointsRef.current.length === 1 ? 'Click Point B to measure' : 'Click Point A in 3D')}
              {activeTool === 'height' && (pendingPointsRef.current.length === 1 ? 'Click Roof/Top' : 'Click Base Ground')}
              {activeTool === 'area' && `Points: ${pendingPointsRef.current.length}/3`}
            </span>
          )}
        </div>
      </div>

      {/* Floating Measurement Chips in 3D Viewport */}
      {measurements.length > 0 && (
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-md pointer-events-none">
          {measurements.slice(-3).map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 px-2.5 py-1 rounded-lg text-xs shadow-md flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-slate-300 text-[11px]">{m.label}:</span>
              <span className="font-mono font-bold text-white text-xs">
                {m.value.toFixed(1)} {m.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';
