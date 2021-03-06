import { createStore } from "redux";

import reducer from "./reducers";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const dispatch = store.dispatch;

export const subscribe = store.subscribe;

export default store;
