import React, { Component } from "react";

import Mouse from "jw-mouse";

import Controller from "./controller";
import LifeGrid from "./lifegrid";

import "./app.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.mouse = new Mouse();
    this.blockContextMenu = event => event.preventDefault();
  }

  componentDidMount() {
    const { mouse, blockContextMenu, scene } = this;

    scene.addEventListener("contextmenu", blockContextMenu);

    mouse.attach(scene);
  }

  componentWillUnmount() {
    const { mouse, blockContextMenu, scene } = this;

    scene.removeEventListener("contextmenu", blockContextMenu);

    mouse.detach();
  }

  render() {
    return (
      <div id="gameoflife-scene" ref={s => (this.scene = s)}>
        <Controller />
        <LifeGrid />
      </div>
    );
  }
}

export default App;
