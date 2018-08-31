import React, { Component } from "react";
import PropTypes from "prop-types";
import Classnames from "classnames";
import { connect } from "react-redux";
import ColorPicker from "jw-color-picker";

import {
  CHANGE_SPEED,
  TOGGLE_PLAY,
  TOGGLE_DRAW_MODE,
  TOGGLE_ERASE_MODE,
  TOGGLE_INFINITE_LIFE,
  CHANGE_SIZE,
  CHANGE_SHAPE,
  SET_ROW,
  SET_COLUMN,
  CHANGE_LIFESPAN,
  SET_START_COLOR,
  SET_END_COLOR
} from "../actiontypes";
import { SQUARE, CIRCLE, TRIANGLE, VERTICAL_BAR, HYPHEN } from "../utils";

import FPS from "../resources/fps.png";
import Grid from "../resources/grid.png";
import Rows from "../resources/rows.png";
import Columns from "../resources/columns.png";
import Size from "../resources/size.png";
import Cursor from "../resources/cursor.png";
import Play from "../resources/play.png";
import Pause from "../resources/pause.png";
import Draw from "../resources/draw.png";
import Erase from "../resources/erase.png";
import Infinite from "../resources/infinity.png";
import Finite from "../resources/finity.png";
import Cell from "../resources/cell.png";
import Lifespan from "../resources/lifespan.png";

import "./style.css";

const { max } = Math;
const shapeSymbols = {
  [SQUARE]: "■",
  [CIRCLE]: "●",
  [TRIANGLE]: "▲",
  [VERTICAL_BAR]: "|",
  [HYPHEN]: "-"
};

const NumericInput = ({ className, icon, value, onChange, ...rest }) => (
  <div className={Classnames("input", className)}>
    <img src={icon} alt="input icon" />
    <input
      {...rest}
      type="text"
      value={value}
      onKeyDown={event => {
        const keyCode = event.which || event.keyCode;

        if (keyCode === 38) {
          onChange(value + 1);
        } else if (keyCode === 40) {
          onChange(value - 1);
        }
      }}
      onChange={event => {
        const value = event.target.value;
        if (!/\D/.test(value)) {
          onChange(value);
        }
      }}
    />
  </div>
);

NumericInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

class Controller extends Component {
  constructor(props) {
    super(props);

    this.state = { show: "" };
  }

  render() {
    const {
      iterator,
      editor,
      cell,
      grid,
      changeSpeed,
      togglePlay,
      toggleDrawMode,
      toggleEraseMode,
      toggleInfiniteLife,
      changeSize,
      changeShape,
      changeRow,
      changeColumn,
      changeLifespan,
      setStartColor,
      setEndColor
    } = this.props;
    const { isPlaying, fps } = iterator;
    const { drawMode, eraseMode, shape, size } = editor;
    const { infiniteLife, lifespan, startColor, endColor } = cell;
    const { rows, columns } = grid;
    const { show } = this.state;

    return (
      <div id="gameoflife-controller">
        <div id="controller-animator">
          <button
            className="button"
            style={{ backgroundImage: `url(${isPlaying ? Pause : Play})` }}
            onClick={() => togglePlay()}
          />
          <NumericInput
            icon={FPS}
            value={fps}
            onChange={value => changeSpeed(max(1, value))}
          />
        </div>
        <button
          className="button"
          style={{ backgroundImage: `url(${Grid})` }}
          onClick={() => this.setState({ show: show === "grid" ? "" : "grid" })}
        />
        <div className={Classnames("menu", { show: show === "grid" })}>
          <NumericInput
            icon={Rows}
            value={rows}
            onChange={value => changeRow(max(1, value))}
          />
          <NumericInput
            icon={Columns}
            value={columns}
            onChange={value => changeColumn(max(1, value))}
          />
        </div>
        <button
          className="button"
          style={{
            backgroundImage: `url(${
              drawMode ? Draw : eraseMode ? Erase : Cursor
            })`
          }}
          onClick={() =>
            this.setState({ show: show === "cursor" ? "" : "cursor" })
          }
        />
        <div className={Classnames("menu", { show: show === "cursor" })}>
          <button
            className={Classnames("button", "toggle-button", {
              active: drawMode
            })}
            style={{ backgroundImage: `url(${Draw})` }}
            onClick={() => toggleDrawMode()}
          />
          <button
            className={Classnames("button", "toggle-button", {
              active: eraseMode
            })}
            style={{ backgroundImage: `url(${Erase})` }}
            onClick={() => toggleEraseMode()}
          />
        </div>
        <button
          className="button"
          onClick={() =>
            this.setState({ show: show === "shape" ? "" : "shape" })
          }
        >
          {shapeSymbols[shape]}
        </button>
        <div className={Classnames("menu", { show: show === "shape" })}>
          <button
            className={Classnames("button", "toggle-button", {
              active: shape === SQUARE
            })}
            onClick={() => changeShape(SQUARE)}
          >
            {shapeSymbols[SQUARE]}
          </button>
          <button
            className={Classnames("button", "toggle-button", {
              active: shape === CIRCLE
            })}
            onClick={() => changeShape(CIRCLE)}
          >
            {shapeSymbols[CIRCLE]}
          </button>
          <button
            className={Classnames("button", "toggle-button", {
              active: shape === TRIANGLE
            })}
            onClick={() => changeShape(TRIANGLE)}
          >
            {shapeSymbols[TRIANGLE]}
          </button>
          <button
            className={Classnames("button", "toggle-button", {
              active: shape === VERTICAL_BAR
            })}
            onClick={() => changeShape(VERTICAL_BAR)}
          >
            {shapeSymbols[VERTICAL_BAR]}
          </button>
          <button
            className={Classnames("button", "toggle-button", {
              active: shape === HYPHEN
            })}
            onClick={() => changeShape(HYPHEN)}
          >
            {shapeSymbols[HYPHEN]}
          </button>
        </div>
        <NumericInput
          icon={Size}
          value={size}
          onChange={value => changeSize(max(1, value))}
        />
        <button
          className="button"
          style={{ backgroundImage: `url(${Cell})` }}
          onClick={() => this.setState({ show: show === "cell" ? "" : "cell" })}
        />
        <div className={Classnames("menu", { show: show === "cell" })}>
          <button
            className="button"
            style={{
              backgroundImage: `url(${infiniteLife ? Infinite : Finite})`
            }}
            onClick={() => toggleInfiniteLife()}
          />
          <NumericInput
            className={Classnames({ hide: infiniteLife })}
            icon={Lifespan}
            value={lifespan}
            onChange={value => changeLifespan(max(1, value))}
          />
          <ColorPicker
            className="colorpicker"
            color={startColor}
            onChange={value => setStartColor(value)}
          />
          <ColorPicker
            className={Classnames("colorpicker", { hide: infiniteLife })}
            color={endColor}
            onChange={value => setEndColor(value)}
          />
        </div>
      </div>
    );
  }
}

Controller.propTypes = {
  iterator: PropTypes.shape(),
  editor: PropTypes.shape(),
  cell: PropTypes.shape(),
  grid: PropTypes.shape(),
  changeSpeed: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  toggleDrawMode: PropTypes.func.isRequired,
  toggleEraseMode: PropTypes.func.isRequired,
  toggleInfiniteLife: PropTypes.func.isRequired,
  changeSize: PropTypes.func.isRequired,
  changeShape: PropTypes.func.isRequired,
  changeRow: PropTypes.func.isRequired,
  changeColumn: PropTypes.func.isRequired,
  changeLifespan: PropTypes.func.isRequired,
  setStartColor: PropTypes.func.isRequired,
  setEndColor: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  changeSpeed: fps => dispatch({ type: CHANGE_SPEED, fps }),
  togglePlay: () => dispatch({ type: TOGGLE_PLAY }),
  toggleDrawMode: () => dispatch({ type: TOGGLE_DRAW_MODE }),
  toggleEraseMode: () => dispatch({ type: TOGGLE_ERASE_MODE }),
  toggleInfiniteLife: () => dispatch({ type: TOGGLE_INFINITE_LIFE }),
  changeSize: size => dispatch({ type: CHANGE_SIZE, size }),
  changeShape: shape => dispatch({ type: CHANGE_SHAPE, shape }),
  changeRow: rows => dispatch({ type: SET_ROW, rows }),
  changeColumn: columns => dispatch({ type: SET_COLUMN, columns }),
  changeLifespan: lifespan => dispatch({ type: CHANGE_LIFESPAN, lifespan }),
  setStartColor: color => dispatch({ type: SET_START_COLOR, color }),
  setEndColor: color => dispatch({ type: SET_END_COLOR, color })
});

export default connect(
  state => state,
  mapDispatchToProps
)(Controller);
