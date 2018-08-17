import {
  SET_START_COLOR,
  SET_END_COLOR,
  TOGGLE_INFINITE_LIFE,
  CHANGE_LIFESPAN
} from "../actiontypes";

export default (
  state = {
    startColor: { r: 0, g: 255, b: 0, a: 1 },
    endColor: { r: 255, g: 125, b: 0, a: 1 },
    infiniteLife: false,
    lifespan: 500
  },
  action
) => {
  let { startColor, endColor, infiniteLife, lifespan } = state;

  switch (action.type) {
    case SET_START_COLOR:
      return { startColor: action.color, endColor, infiniteLife, lifespan };
    case SET_END_COLOR:
      return { startColor, endColor: action.color, infiniteLife, lifespan };
    case TOGGLE_INFINITE_LIFE:
      return { startColor, endColor, infiniteLife: !infiniteLife, lifespan };
    case CHANGE_LIFESPAN:
      return { startColor, endColor, infiniteLife, lifespan: action.lifespan };
    default:
      return state;
  }
};
