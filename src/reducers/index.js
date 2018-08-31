import { combineReducers } from "redux";
import grid from "./reducer.grid";
import editor from "./reducer.editor";
import iterator from "./reducer.iterator";
import cell from "./reducer.cell";

export default combineReducers({
  grid,
  editor,
  iterator,
  cell
});
