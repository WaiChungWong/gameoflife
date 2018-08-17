import { combineReducers } from "redux";
import grid from "./reducer.grid";
import cursor from "./reducer.cursor";
import animator from "./reducer.animator";
import cell from "./reducer.cell";

export default combineReducers({
  grid,
  cursor,
  animator,
  cell
});
