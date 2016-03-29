import THREE, { Object3D } from 'three';
import TWEEN from 'tween';
import { FIGURES, DIMENSION, SCALE } from 'constants';
import Box from './box';

const SIDE = 2;
const MARGIN = 0.4;

export default class Figures extends Object3D {
  constructor(data$figures) {
    super();

    this.BAZE = 6;
    this.SIDE = SIDE * DIMENSION / 2 / this.BAZE;
    this.SIZE = (SIDE + MARGIN) * DIMENSION / 2 / this.BAZE;

    this.position.set(0, -((DIMENSION / 2) * (SIDE + MARGIN) + (this.BAZE / 2) * this.SIZE), 0);

    // array of Object3D groups (2 elements)
    this.boxes = [];
    this.box = new Box(SCALE / this.BAZE * DIMENSION / 2);

    this.data$figures = data$figures;

    /*
    {
      const helper = new THREE.GridHelper(this.BAZE * 2, this.SIZE);
      helper.setColors(0x555555, 0xbbbbbb);
      helper.rotation.x = Math.PI / 2;
      helper.position.z = 1.2;
      this.add(helper);
    }
    */ // !DEBUG GridHelper

    /*
    {
      const geometry = new THREE.PlaneGeometry(this.SIZE * this.BAZE * 2, this.SIZE * this.BAZE);
      const material = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
      this.add(plane);
    }
    */ // !DEBUG Plane

    this.render();
  }

  update(data$figure, data$index) {
    this.data$figures[data$index] = data$figure;

    const _el = {
      index: data$index,
      id: data$figure,
      figure: FIGURES[data$figure]
    };

    const _boxes = this.boxes[data$index].children;

    const size = { min: { x: _el.figure[0].x, y: _el.figure[0].y }, max: { x: _el.figure[0].x, y: _el.figure[0].y } };
    _el.figure.forEach(coord => {
      if (coord.x > size.max.x) {
        size.max.x = coord.x;
      } else if (coord.x < size.min.x) {
        size.min.x = coord.x;
      }
      if (coord.y > size.max.y) {
        size.max.y = coord.y;
      } else if (coord.y < size.min.y) {
        size.min.y = coord.y;
      }
    });

    _boxes.forEach((box, _i) => {
      const _x = (_el.figure[_i].x - (size.max.x - size.min.x) / 2) * this.SIZE;
      const _y = (_el.figure[_i].y - (size.max.y - size.min.y) / 2) * this.SIZE;
      const _z = 1;
      new TWEEN.Tween(box.position).to({
        x: _x,
        y: _y,
        z: _z
      }, 700)
      .easing(TWEEN.Easing.Quintic.In).start();
    });
  }

  render() {
    const _data$figures = this.data$figures.map((figure, index) => {
      return {
        index: index,
        id: figure,
        figure: FIGURES[figure]
      };
    });

    _data$figures.forEach((_el, index) => {
      const size = { min: { x: _el.figure[0].x, y: _el.figure[0].y }, max: { x: _el.figure[0].x, y: _el.figure[0].y } };
      const _group = new THREE.Object3D();
      const clones = [];
      _el.figure.forEach(coord => {
        if (coord.x > size.max.x) {
          size.max.x = coord.x;
        } else if (coord.x < size.min.x) {
          size.min.x = coord.x;
        }
        if (coord.y > size.max.y) {
          size.max.y = coord.y;
        } else if (coord.y < size.min.y) {
          size.min.y = coord.y;
        }
      });
      _el.figure.forEach(coord => {
        const clone = this.box.clone();
        clone.material = this.box.material.clone();
        clone.userData = {
          x: coord.x,
          y: coord.y,
          z: 1,
          id: index
        };
        const _x = (coord.x - (size.max.x - size.min.x) / 2) * this.SIZE;
        const _y = (coord.y - (size.max.y - size.min.y) / 2) * this.SIZE;
        const _z = 1;
        clone.position.set(_x, _y, _z);
        clones.push(clone);
        _group.add(clone);
      });
      _group.position.set((2 * index - 1) * 1 / 2 * this.SIZE * this.BAZE, 0, 0);
      this.boxes.push(_group);
      this.add(_group);
    });
  }
}
