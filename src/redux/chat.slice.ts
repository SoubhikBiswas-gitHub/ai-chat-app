import { createSlice } from "@reduxjs/toolkit";
import { ChatState } from "../types/chat.type";

const initialState: ChatState = {
  chatsList: [],
  chatsContent: null,
  message: null,
  activeChatId: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatsList: (state, action) => {
      state.chatsList = action.payload;
    },
    setChatsContent: (state, action) => {
      state.chatsContent = action.payload;
    },
    setChatMessage: (state, action) => {
      state.message = action.payload;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
  },
});

export const ChatActions = chatSlice.actions;
export const ChatReducer = chatSlice.reducer;
