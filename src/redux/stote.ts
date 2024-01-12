import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({});

const store = configureStore({
  reducer: rootReducer,
});

// export const persistor = persistStore(store);

export default store;

// For better usage with typescript
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
export const useAppDispatch: () => AppDispatchType = useDispatch;

export const useAppSelector = <T>(selector: (state: RootStateType) => T): T =>
  useSelector(selector);
