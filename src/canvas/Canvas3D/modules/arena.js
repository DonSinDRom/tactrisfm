import { Object3D } from 'three';
import TWEEN from 'tween';
import { FIGURES, DIMENSION, SCALE, STATUS, SIDE, MARGIN } from 'constants';
import Box from './box';

export default class Arena extends Object3D {
  constructor(data$figures, action$generate, action$increment, action$gameOver) {
    super();

    this.SIZE = SIDE + MARGIN;
    this.position.set(-this.SIZE * (DIMENSION - 1) / 2, -this.SIZE * (DIMENSION - 1) / 2, 0);

    this.order = {
      x: [],
      y: [],
      mask: []
    };
    this.state = [];
    this.touches = [];

    this.boxes = [];
    this.box = new Box(SCALE);

    this.multiplicator = 0;
    this.score = 0;

    this.data$figures = data$figures;
    this.action$generate = action$generate;
    this.action$increment = action$increment;
    this.action$gameOver = action$gameOver;

    this.render();
  }

  render() {
    for (let _i = 0; _i < DIMENSION; _i++) {
      this.order.x.push(_i);
      this.order.y.push(_i);
      this.order.mask.push(_i);
      for (let _y = 0; _y < DIMENSION; _y++) {
        this.state.push(STATUS.untouched.code);
      }
    }
    this.state.forEach((state, id) => {
      const clone = this.box.clone();
      const _x = id % DIMENSION;
      const _y = Number.parseInt(id / DIMENSION, 10);
      clone.userData = {
        x: _x,
        y: _y,
        z: 0,
        id: id
      };
      clone.material = this.box.material.clone();
      clone.position.set(this.order.x.indexOf(_x) * this.SIZE, this.order.y.indexOf(_y) * this.SIZE, 1);
      clone.scale.set(0.1, 0.1, 0.1);

      let emissive;
      switch (state) {
        case STATUS.untouched.code:
          emissive = new TWEEN.Tween(clone.material.emissive).to(STATUS.untouched.emissive, 500);
          break;
        case STATUS.touched.code:
          emissive = new TWEEN.Tween(clone.material.emissive).to(STATUS.touched.emissive, 500);
          break;
        case STATUS.placed.code:
          emissive = new TWEEN.Tween(clone.material.emissive).to(STATUS.placed.emissive, 500);
          break;
        default:
          console.log('error');
      }

      if (emissive) {
        const scaleOut = new TWEEN.Tween(clone.scale).to({
          x: 0.1,
          y: 0.1,
          z: 0.1
        }, 500);
        const scaleIn = new TWEEN.Tween(clone.scale).to({
          x: SCALE,
          y: SCALE,
          z: SCALE
        }, 500);
        scaleOut.chain(scaleIn);
        scaleOut.chain(scaleIn, emissive).start();
      }

      this.boxes.push(clone);
      this.add(clone);
    });
    /* for (let _y = 0; _y < DIMENSION; _y++) {
      for (let _x = 0; _x < DIMENSION; _x++) {
        const clone = this.box.clone();
        clone.userData = {
          x: _x,
          y: _y,
          z: 0,
          id: _y * DIMENSION + _x
        };
        clone.material = this.box.material.clone();
        clone.position.set(_x * this.SIZE, _y * this.SIZE, 1);
        clone.scale.set(0.1, 0.1, 0.1);
        // new TWEEN.Tween(clone.material.emissive).to({ r: Math.pow(0.75, 3), g: 0, b: 0 }, 5000).delay(1000).start();

        const scaleOut = new TWEEN.Tween(clone.scale).to({
          x: 0.1,
          y: 0.1,
          z: 0.1
        }, 500);
        const scaleIn = new TWEEN.Tween(clone.scale).to({
          x: SCALE,
          y: SCALE,
          z: SCALE
        }, 500);
        scaleOut.chain(scaleIn).start();

        this.boxes.push(clone);
        this.add(clone);
      }
    } */
  }

  lineShift($line, $direction, $delay = 0) {
    const _order = this.order[$direction];
    const _line = _order.indexOf($line);
    const _linesToShift = _line > (DIMENSION - 1) / 2 ? _order.slice(_line, DIMENSION) : _order.slice(0, _line + 1).reverse();
    const linesToShift = _linesToShift.map((line, index) => {
      return {
        index: line,
        diff: index ? 1 : -1 * (_linesToShift.length - 1)
      };
    });

    const polarity = _line > ((DIMENSION - 1) / 2) ? 1 : -1;

    linesToShift.map((line, index) => {
      this.order[$direction].forEach(el => {
        const id = $direction === 'x' ? el * DIMENSION + line.index : line.index * DIMENSION + el;
        const block = this.boxes[id];

        if (index === 0) {
          const position = new TWEEN.Tween(block.position).to({
            [$direction]: (this.order[$direction].indexOf(line.index) - polarity * line.diff) * this.SIZE
          }, 200).onComplete(() => block.visible = true);
          const scaleOut = new TWEEN.Tween(block.scale).to({
            x: 0.1,
            y: 0.1,
            z: 0.1
          }, 250).onComplete(() => block.visible = false);
          const scaleIn = new TWEEN.Tween(block.scale).to({
            x: SCALE,
            y: SCALE,
            z: SCALE
          }, 250);
          const emissive = new TWEEN.Tween(block.material.emissive).to(STATUS.untouched.emissive, 250);
          position.chain(scaleIn);
          scaleOut.chain(position, emissive).delay(1000 * $delay).start();
          this.state[id] = STATUS.untouched.code;
        } else {
          new TWEEN.Tween(block.position).to({
            [$direction]: (this.order[$direction].indexOf(line.index) - polarity * line.diff) * this.SIZE
          }, 700).delay(1000 * $delay).start();
        }
      });
    });

    this.order[$direction].splice(this.order[$direction].indexOf(linesToShift[0].index), 1);
    if (polarity > 0) {
      this.order[$direction].push(linesToShift[0].index);
    } else {
      this.order[$direction].unshift(linesToShift[0].index);
    }
    this.score += ++this.multiplicator * DIMENSION;
  }

  setState($id, $status) {
    this.state[$id] = $status.code;
    new TWEEN.Tween(this.boxes[$id].material.emissive).to($status.emissive, 0)
    .easing(TWEEN.Easing.Exponential.Out).start();
    // boxes[$id].material.emissive = $STATUS.emissive;
    // boxes[$id].material.emissive = 0x860111;
  }

  touch($id) {
    switch (this.state[$id]) {
      case STATUS.untouched.code:
        this.state[$id] = 0;
        if (this.touches.length === 4) {
          const id = this.touches.shift();
          this.setState(id, STATUS.untouched);
        }
        if (this.touches.indexOf($id) === -1) {
          this.touches.push($id);
        }
        this.setState($id, STATUS.touched);
        this.checkFigure();
        break;
      case STATUS.touched.code:
        // this.setState($id, STATUS.placed);
        break;
      case STATUS.placed.code:
        // this.setState($id, STATUS.untouched);
        break;
      default:
        console.log('error');
    }
  }

  checkFigure() {
    if (this.touches.length === 4) {
      if (this.touches.length === 4) {
        if (this.data$figures.length === 2) {
          const _touches = this.touches.map(touch => {
            return {
              x: this.order.x.indexOf(touch % DIMENSION),
              y: this.order.y.indexOf(Number.parseInt(touch / DIMENSION, 10))
            };
          });
          // _n is a Block with coordinates [0, 0] in 4x4 pole
          const _n = {
            x: _touches[0].x,
            y: _touches[0].y
          };

          // _h is a area of Blocks where user can probably place the figure. Max figure length and width is 4 blocks, so we dont need to check all blocks, just 16 of them (4x4)
          const _h = _touches.map(touch => {
            _n.x = Math.min(_n.x, touch.x);
            _n.y = Math.min(_n.y, touch.y);
            return touch;
          }).sort((_a, _b) => _a.x - _b.x !== 0 ? _a.x - _b.x : _a.y - _b.y);

          const fs = this.data$figures.map(figure => FIGURES[figure]);
          fs.some((figure, figureIndex) => {
            if (figure.every((_f, _i) => _f.x === _h[_i].x - _n.x && _f.y === _h[_i].y - _n.y ? true : false)) {
              this.touches.forEach(touch => {
                this.setState(touch, STATUS.placed);
              });
              this.touches = [];
              this.score += 4;
              this.action$generate(figureIndex);
              this.checkLines();
              this.action$increment(this.score);
              this.score = 0;
              this.isGameover();
            }
          });
        }
      }
    }
  }

  checkLines() {
    const mask = this.order.mask;
    const xs = mask.slice();
    const ys = mask.slice();

    this.state.forEach((_s, _i) => {
      if (_s !== STATUS.placed.code) {
        const _x = _i % DIMENSION;
        const _y = Number.parseInt(_i / DIMENSION, 10);
        if (xs.indexOf(_x) !== -1) {
          xs.splice(xs.indexOf(_x), 1);
        }
        if (ys.indexOf(_y) !== -1) {
          ys.splice(ys.indexOf(_y), 1);
        }
      }
    });

    const toT = ys.filter(_e => _e >= DIMENSION / 2).sort((_a, _b) => this.order.y.indexOf(_a) - this.order.y.indexOf(_b)); // toTop     +y
    const toR = xs.filter(_e => _e >= DIMENSION / 2).sort((_a, _b) => this.order.x.indexOf(_a) - this.order.x.indexOf(_b)); // toRight   +x
    const toB = ys.filter(_e => _e < DIMENSION / 2).sort((_a, _b) => this.order.y.indexOf(_b) - this.order.y.indexOf(_a));  // toBottom  -y
    const toL = xs.filter(_e => _e < DIMENSION / 2).sort((_a, _b) => this.order.x.indexOf(_b) - this.order.x.indexOf(_a));  // toLeft    -x

    toT.forEach((_y, _i) => this.lineShift(_y, 'y', _i));
    toR.forEach((_x, _i) => this.lineShift(_x, 'x', _i));
    toB.forEach((_y, _i) => this.lineShift(_y, 'y', _i));
    toL.forEach((_x, _i) => this.lineShift(_x, 'x', _i));

    this.multiplicator = 0;
  }

  _canPlaceFigure(data$figure) {
    const size = data$figure.reduce((_c, _p) => {
      return { x: Math.max(_c.x, _p.x), y: Math.max(_c.y, _p.y) };
    });
    return this.state.some((_s, _i) => {
      const _x = _i % DIMENSION;
      const _y = Number.parseInt(_i / DIMENSION, 10);
      if (!(_x + size.x + 1 > DIMENSION || _y + size.y + 1 > DIMENSION)) {
        return data$figure.every(cell => {
          const id = this.order.y[cell.y + _y] * DIMENSION + this.order.x[cell.x + _x];
          return this.state[id] === STATUS.untouched.code;
        });
      }
    });
  }

  isGameover() {
    const figures = this.data$figures.map(figure => FIGURES[figure]);

    const isGameOver = !figures.some(figure => this._canPlaceFigure(figure));

    if (isGameOver) {
      // alert('Game over');
      this.action$gameOver();
      this.reset();
    }
  }

  reset() {
    this.order = {
      x: [],
      y: [],
      mask: []
    };
    this.state = [];
    this.touches = [];

    for (let _i = 0; _i < DIMENSION; _i++) {
      this.order.x.push(_i);
      this.order.y.push(_i);
      this.order.mask.push(_i);
      for (let _y = 0; _y < DIMENSION; _y++) {
        this.state.push(STATUS.untouched.code);
      }
    }
    this.state.forEach((state, id) => {
      const _x = id % DIMENSION;
      const _y = Number.parseInt(id / DIMENSION, 10);
      const box = this.boxes[id];

      const emissive = new TWEEN.Tween(box.material.emissive).to(STATUS.untouched.emissive, 500);
      const position = new TWEEN.Tween(box.position).to({
        x: this.order.x.indexOf(_x) * this.SIZE, y: this.order.y.indexOf(_y) * this.SIZE, z: 1
      }, 500);
      emissive.chain(position).start();
    });
  }

  updateFigures(data$figure, $index) {
    this.data$figures[$index] = data$figure;
  }

}
