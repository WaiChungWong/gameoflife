import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { PLAY, PAUSE } from "../actiontypes";

import Play from "../resources/play.png";
import Pause from "../resources/pause.png";

import "./style.css";

class Controller extends Component {
  render() {
    const { isPlaying, togglePlay } = this.props;

    return (
      <div id="gameoflife-controller">
        <div id="controller-animator">
          <button
            id="play-button"
            style={{ backgroundImage: `url(${isPlaying ? Pause : Play})` }}
            onClick={() => togglePlay(!isPlaying)}
          />
        </div>
        <div id="controller-cursor" />
        <div id="controller-cell" />
      </div>
    );
  }
}

Controller.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  togglePlay: PropTypes.func.isRequired
};

const mapStateToProps = ({ animator }) => ({ ...animator });

const mapDispatchToProps = dispatch => ({
  togglePlay: play => dispatch({ type: play ? PLAY : PAUSE })
});

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
