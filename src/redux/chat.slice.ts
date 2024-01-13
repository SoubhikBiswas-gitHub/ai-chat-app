import { createSlice, nanoid } from "@reduxjs/toolkit";
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
    createChat: (state) => {
      const chat = {
        id: nanoid(),
        chatName: "New Chat",
        feedback: "",
        rating: null,
        isEnded: false,
      };
      state.chatsContent = {
        ...state.chatsContent,
        [chat.id]: [],
      };
      state.chatsList.push(chat);
      state.activeChatId = chat.id;
    },
    setChatsContent: (state, action) => {
      state.chatsContent = action.payload;
    },
    setChatsList: (state, action) => {
      state.chatsList = action.payload;
    },

    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },

    updateChatName: (state, action) => {
      const { chatId, chatName } = action.payload;
      console.log("updateChatName", chatId, chatName);
      if (state.chatsList?.length && chatId && chatName) {
        state.chatsList = state.chatsList.map((chat) =>
          chat.id === chatId ? { ...chat, chatName } : chat
        );
      }
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
          chat[messageIndex].status = ChatInteractionStatusEnum.DISLIKE;
        }
      }
    },
    updateChatFeedback: (state, action) => {
      const { chatId, feedback, rating } = action.payload;
      const chatIndex = state.chatsList.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chatsList[chatIndex].feedback = feedback;
        state.chatsList[chatIndex].rating = rating;
        state.chatsList[chatIndex].isEnded = true;
      } else {
        let chatName = "New Chat";
        if (state.chatsContent) {
          chatName = state.chatsContent[chatId][0].content;
        }

        state.chatsList.push({
          id: chatId,
          chatName,
          feedback,
          rating,
          isEnded: true,
        });
      }
    },
  },
});

export const ChatActions = chatSlice.actions;
export const ChatReducer = chatSlice.reducer;
