import { createSlice } from "@reduxjs/toolkit";
import { ThemeEnum, UtilState } from "../types/util.type";

const initialState: UtilState = {
  isNavigationOpenState: true,
  themeState: ThemeEnum.DARK,
};

export const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    setIsNavigationOpenState: (state, action) => {
      state.isNavigationOpenState = action.payload;
    },
    setThemeState: (state, action) => {
      state.themeState = action.payload;
    },
  },
});

export const UtilActions = utilSlice.actions;
export const UtilReducer = utilSlice.reducer;
