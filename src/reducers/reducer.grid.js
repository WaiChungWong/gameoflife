import { SET_ROW, SET_COLUMN } from "../actiontypes";

export default (state = { rows: 400, columns: 400 }, action) => {
  let { rows, columns } = state;

  switch (action.type) {
    case SET_ROW:
      return { rows: action.rows, columns };
    case SET_COLUMN:
      return { rows, columns: action.columns };
    default:
      return state;
  }
};
