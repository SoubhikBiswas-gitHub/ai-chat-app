import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { UtilReducer } from "./util.slice";

const rootReducer = combineReducers({
  util: UtilReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
export const useAppDispatch: () => AppDispatchType = useDispatch;

export const useAppSelector = <T>(selector: (state: RootStateType) => T): T =>
  useSelector(selector);
