import {
  TOGGLE_DRAW_MODE,
  TOGGLE_ERASE_MODE,
  CHANGE_SHAPE,
  CHANGE_SIZE
} from "../actiontypes";
import { SQUARE } from "../utils";

export default (
  state = { drawMode: false, eraseMode: false, shape: SQUARE, size: 5 },
  action
) => {
  let { drawMode, eraseMode, shape, size } = state;

  switch (action.type) {
    case TOGGLE_DRAW_MODE:
      return { drawMode: !drawMode, eraseMode: false, shape, size };
    case TOGGLE_ERASE_MODE:
      return { drawMode: false, eraseMode: !eraseMode, shape, size };
    case CHANGE_SHAPE:
      return { drawMode, eraseMode, shape: action.shape, size };
    case CHANGE_SIZE:
      return { drawMode, eraseMode, shape, size: action.size };
    default:
      return state;
  }
};
