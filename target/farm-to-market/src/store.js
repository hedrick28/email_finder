import thunk from "redux-thunk";
import { legacy_createStore as create_store, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { allReducers } from "./redux/reducers";

export const store = create_store(
  allReducers,
  composeWithDevTools(applyMiddleware(thunk))
);
