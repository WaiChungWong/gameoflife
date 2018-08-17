import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Animator from "jw-animator";
import AnimateCanvas from "jw-animate-canvas";

import "./style.css";

class LifeGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lifeGrid: []
    };

    this.animate = this.animate.bind(this);
    this.timeBuffer = 0;
  }

  componentDidMount() {
    const { animator } = this.props;

    animator.add(timeDiff => this.update(timeDiff));
  }

  reset() {
    const { grid } = this.props;
    const { rows, columns } = grid;

    let lifeGrid = [];

    for (let y = 0; y < rows; y++) {
      lifeGrid[y] = [];

      for (let x = 0; x < columns; x++) {
        lifeGrid[y][x] = 0;
      }
    }

    this.setState({ lifeGrid });
  }

  getCellAge(y, x, lifeGrid) {
    const { cell, grid } = this.props;
    const { rows, columns } = grid;
    const { lifespan } = cell;

    let cellAge = grid[y][x];

    if (lifespan > 0 && cellAge >= lifespan) {
      return 0;
    } else {
      let numOfLiveNeighbours = 0;

      for (
        let sideY = Math.max(0, y - 1);
        sideY <= y + 1 && sideY < rows;
        sideY++
      ) {
        for (
          let sideX = Math.max(0, x - 1);
          sideX <= x + 1 && sideX < columns;
          sideX++
        ) {
          if ((sideY !== y || sideX !== x) && lifeGrid[sideY][sideX] > 0) {
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
    const { lifeGrid } = this.state;

    let prevGrid = JSON.parse(JSON.stringify(lifeGrid));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        lifeGrid[y][x] = this.getCellAge(y, x, prevGrid);
      }
    }
  }

  update(timeDiff) {
    const { animator } = this.props;
    const { fps } = animator;

    let timeInterval = 1 / fps;

    this.timeBuffer += timeDiff;

    while (timeInterval > 0 && this.timeBuffer >= timeInterval) {
      this.timeBuffer -= timeInterval;
    }
  }

  animate(context, width, height) {
    const { grid } = this.props;
    const { rows, columns } = grid;

    context.clearRect(0, 0, width, height);

    let cellWidth = width / columns;
    let cellHeight = height / rows;

    //// TODO:
    // lifeGrid.drawShadowCells(context, cellWidth, cellHeight);
    //
    // for (var y = 0; y < lifeGrid.rows; y++) {
    //   for (var x = 0; x < lifeGrid.columns; x++) {
    //     lifeGrid.drawCell(
    //       lifeGrid.getCell(y, x),
    //       y,
    //       x,
    //       context,
    //       cellWidth,
    //       cellHeight
    //     );
    //   }
    // }
  }

  render() {
    const { animator } = this.props;

    return (
      <AnimateCanvas
        ref={layer => (this.layer = layer)}
        id="gameoflife-grid"
        animator={animator}
        animate={this.animate}
      />
    );
  }
}

LifeGrid.propTypes = {
  animator: PropTypes.instanceOf(Animator),
  grid: PropTypes.shape({
    rows: PropTypes.number,
    columns: PropTypes.number
  }),
  cell: PropTypes.shape()
};

LifeGrid.defaultProps = {
  animator: new Animator()
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(LifeGrid);
