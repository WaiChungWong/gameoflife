import { TOGGLE_PLAY, CHANGE_SPEED } from "../actiontypes";

export default (state = { isPlaying: true, fps: 30 }, action) => {
  let { isPlaying, fps } = state;

  switch (action.type) {
    case TOGGLE_PLAY:
      return { isPlaying: !isPlaying, fps };
    case CHANGE_SPEED:
      return { isPlaying, fps: action.fps };
    default:
      return state;
  }
};
