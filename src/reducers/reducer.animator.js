import { PLAY, PAUSE, CHANGE_SPEED } from "../actiontypes";

export default (state = { isPlaying: true, fps: 30 }, action) => {
  let { isPlaying, fps } = state;

  switch (action.type) {
    case PLAY:
      return { isPlaying: true, fps };
    case PAUSE:
      return { isPlaying: false, fps };
    case CHANGE_SPEED:
      return { isPlaying, fps: action.fps };
    default:
      return state;
  }
};
