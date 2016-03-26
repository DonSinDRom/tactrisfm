import { Scene, WebGLRenderer, PerspectiveCamera, Raycaster, Vector2, DirectionalLight, HemisphereLight } from 'three';
import TWEEN from 'tween';

import Figures from './figures';
import Arena from './arena';

export default class Canvas {
  constructor($node, data$figures, action$generate, action$increment, action$gameOver) {
    this.scene = new Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setClearColor(0x333333);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    $node.appendChild(this.renderer.domElement);

    const camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, -6, 60);
    camera.lookAt(this.scene.position);
    this.camera = camera;
    this.scene.add(camera);

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.objects = [];

    const arena = new Arena(data$figures, action$generate, action$increment, action$gameOver);
    this.scene.add(arena);
    this.objects.push(arena);
    this.arena = arena;

    const figures = new Figures(data$figures);
    this.figures = figures;
    this.scene.add(figures);

    /* {
      const helper = new THREE.GridHelper(DIMENSION * 2, 1);
      helper.setColors(0x444444, 0x929292);
      helper.rotation.x = Math.PI / 2;
      this.scene.add(helper);
    } // !DEBUG GridHelper */

    const directionalLight = new DirectionalLight(0x777777, 0.15);
    directionalLight.position.set(0, 6, 1000);
    this.scene.add(directionalLight);

    const hemisphereLight = new HemisphereLight(0x999999, 0x333333, 2);
    hemisphereLight.position.set(0, 0, 100);
    this.scene.add(hemisphereLight);

    this.mousing = false;

    this.onDocumentClick = (event) => {
      event.preventDefault();
      this._intersectObjects(event);
    };
    this.onDocumentMouseDown = (event) => {
      event.preventDefault();
      this.mousing = true;
    };
    this.onDocumentMouseMove = (event) => {
      event.preventDefault();
      if (this.mousing) {
        this._intersectObjects(event);
      }
    };
    this.onDocumentMouseUp = (event) => {
      event.preventDefault();
      this.mousing = false;
    };

    $node.addEventListener('click', this.onDocumentClick, false);
    $node.addEventListener('mousedown', this.onDocumentMouseDown, false);
    $node.addEventListener('mousemove', this.onDocumentMouseMove, false);
    $node.addEventListener('mouseup', this.onDocumentMouseUp, false);

    this.onWindowResize = (event) => {
      event.preventDefault();
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this.onWindowResize, false);

    this.animate = () => {
      requestAnimationFrame(this.animate);
      this.render();
    };

    this.animate();
  }

  _intersectObjects(event) {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const block = intersects[0].object;
      const id = block.userData.id;

      if (id !== undefined) {
        this.arena.touch(id);
      }
    }
  }

  updateFigures(data$figure, data$index) {
    this.figures.update(data$figure, data$index);
    this.arena.updateFigures(data$figure, data$index);
  }

  render() {
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }
}
