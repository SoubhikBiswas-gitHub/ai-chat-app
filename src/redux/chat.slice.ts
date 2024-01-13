import { createSlice } from "@reduxjs/toolkit";
import { ChatInteractionStatusEnum, ChatState } from "../types/chat.type";

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
    setLikeMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (state.chatsContent && state.chatsContent[chatId]) {
        const updatedChat = state.chatsContent[chatId].map((message) =>
          message.id === messageId
            ? { ...message, status: ChatInteractionStatusEnum.LIKE }
            : message
        );
        state.chatsContent = { ...state.chatsContent, [chatId]: updatedChat };
      }
    },

    setDislikeMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (state.chatsContent) {
        const chat = state.chatsContent[chatId];
        const messageIndex = chat.findIndex(
          (message) => message.id === messageId
        );
        if (messageIndex !== -1) {
          chat[messageIndex].status = ChatInteractionStatusEnum.DISLIKE; // or use an enum if you have it defined
        }
      }
    },
  },
});

export const ChatActions = chatSlice.actions;
export const ChatReducer = chatSlice.reducer;
