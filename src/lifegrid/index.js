import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Mouse from "jw-mouse";
import Animator from "jw-animator";
import AnimateCanvas from "jw-animate-canvas";

import { iterateShape } from "../utils";

import "./style.css";

const { min, max, floor, round } = Math;

class LifeGrid extends Component {
  constructor(props) {
    super(props);

    this.shadowCells = [];
    this.lifeGrid = [];
    this.timeBuffer = 0;

    this.mouseEvent = this.mouseEvent.bind(this);
    this.animate = this.animate.bind(this);

    this.mouse = new Mouse();
    this.mouse.onEnter(this.mouseEvent);
    this.mouse.onLeave(this.mouseEvent);
    this.mouse.onMove(this.mouseEvent);
    this.mouse.onDown(this.mouseEvent);
    this.mouse.onUp(this.mouseEvent);
  }

  mouseEvent({ mouse }) {
    const { gridElement } = this;
    const { grid, editor } = this.props;
    const { rows, columns } = grid;
    const { width, height } = gridElement.canvas;
    const { drawMode, eraseMode, shape, size } = editor;
    const { isLeftButton, isMouseDown, position } = mouse;

    this.shadowCells = [];

    if (position && position.x && position.y) {
      let pointX = floor((position.x / width) * columns);
      let pointY = floor((position.y / height) * rows);

      if (isLeftButton && isMouseDown) {
        iterateShape(shape, size, pointX, pointY, rows, columns, (y, x) => {
          if (drawMode) {
            this.lifeGrid[y][x] = 1;
          } else if (eraseMode) {
            this.lifeGrid[y][x] = 0;
          }
        });
      }

      if (drawMode || eraseMode) {
        iterateShape(shape, size, pointX, pointY, rows, columns, (y, x) => {
          this.shadowCells.push({ y, x });
        });
      }
    }
  }

  componentDidMount() {
    const { animator } = this.props;

    animator.add(timeDiff => this.update(timeDiff));

    this.reset();
    this.mouse.attach(this.gridElement.canvas);
    animator.start();
  }

  componentWillUnmount() {
    this.mouse.detach(this.gridElement.canvas);
    this.props.animator.stop();
  }

  reset() {
    const { grid } = this.props;
    const { rows, columns } = grid;

    this.lifeGrid = [];

    for (let y = 0; y < rows; y++) {
      this.lifeGrid[y] = [];

      for (let x = 0; x < columns; x++) {
        this.lifeGrid[y][x] = 0;
      }
    }
  }

  getUpdatedCellAge(y, x) {
    const { grid, cell } = this.props;
    const { rows, columns } = grid;
    const { lifeGrid } = this;
    const { lifespan, infiniteLife } = cell;

    let cellAge = (lifeGrid[y] && lifeGrid[y][x]) || 0;

    if (lifespan > 0 && !infiniteLife && cellAge >= lifespan) {
      cellAge = 0;
    } else {
      let numOfLiveNeighbours = 0;

      for (let sY = max(0, y - 1); sY <= min(y + 1, rows - 1); sY++) {
        for (let sX = max(0, x - 1); sX <= min(x + 1, columns - 1); sX++) {
          if ((sY !== y || sX !== x) && lifeGrid[sY] && lifeGrid[sY][sX] > 0) {
            numOfLiveNeighbours++;
          }
        }
      }

      if (numOfLiveNeighbours === 3) {
        cellAge += 1;
      } else if (numOfLiveNeighbours !== 2) {
        cellAge = 0;
      }

      if (cellAge > 0) {
        cellAge++;
      }
    }

    return cellAge;
  }

  updateGrid() {
    const { grid } = this.props;
    const { rows, columns } = grid;

    let newGrid = [];

    for (let y = 0; y < rows; y++) {
      newGrid[y] = [];

      for (let x = 0; x < columns; x++) {
        newGrid[y][x] = this.getUpdatedCellAge(y, x);
      }
    }

    this.lifeGrid = newGrid;
  }

  update(timeDiff) {
    const { iterator } = this.props;
    const { isPlaying, fps } = iterator;

    if (isPlaying) {
      let timeInterval = 1 / fps;

      this.timeBuffer += timeDiff;

      if (timeInterval > 0 && this.timeBuffer >= timeInterval) {
        this.timeBuffer -= timeInterval;

        this.updateGrid();
      }
    }
  }

  drawShadowCells(context, cellWidth, cellHeight) {
    context.fillStyle = "rgba(125, 125, 125, 0.5)";

    let { shadowCells } = this;

    for (let i = 0; i < shadowCells.length; i++) {
      let x = shadowCells[i].x;
      let y = shadowCells[i].y;

      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }

  drawLiveCell(age, y, x, context, cellWidth, cellHeight) {
    const { cell } = this.props;
    const { startColor, endColor, infiniteLife, lifespan } = cell;
    const { r: startR, g: startG, b: startB, a: startA } = startColor;
    const { r: endR, g: endG, b: endB, a: endA } = endColor;

    if (age > 0) {
      let r = startR;
      let g = startG;
      let b = startB;
      let a = startA;

      if (lifespan > 0 && !infiniteLife) {
        let delta = age / lifespan;

        r += round((endR - startR) * delta);
        g += round((endG - startG) * delta);
        b += round((endB - startB) * delta);
        a += round((endA - startA) * delta);
      }

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }

  drawLiveCells(context, cellWidth, cellHeight) {
    const { grid } = this.props;
    const { rows, columns } = grid;
    const { lifeGrid } = this;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let age = (lifeGrid[y] && lifeGrid[y][x]) || 0;
        this.drawLiveCell(age, y, x, context, cellWidth, cellHeight);
      }
    }
  }

  animate(context, width, height) {
    const { grid } = this.props;
    const { rows, columns } = grid;

    context.clearRect(0, 0, width, height);

    let cellWidth = width / columns;
    let cellHeight = height / rows;

    this.drawShadowCells(context, cellWidth, cellHeight);
    this.drawLiveCells(context, cellWidth, cellHeight);
  }

  render() {
    const { animator } = this.props;

    return (
      <div id="gameoflife-grid">
        <AnimateCanvas
          ref={g => (this.gridElement = g)}
          animator={animator}
          animate={this.animate}
        />
      </div>
    );
  }
}

LifeGrid.propTypes = {
  animator: PropTypes.instanceOf(Animator),
  iterator: PropTypes.shape(),
  grid: PropTypes.shape(),
  editor: PropTypes.shape(),
  cell: PropTypes.shape()
};

LifeGrid.defaultProps = {
  animator: new Animator()
};

export default connect(
  state => state,
  () => ({})
)(LifeGrid);
