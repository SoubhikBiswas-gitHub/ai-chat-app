export enum AuthorEnum {
  USER = "USER",
  BOT = "BOT",
}

export enum ChatInteractionStatusEnum {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
  NO_INTERACTION = "NO_INTERACTION",
}
export interface Message {
  id: string;
  content: string;
  author: AuthorEnum;
  status: ChatInteractionStatusEnum;
}
export interface chatsContent {
  [key: string]: Array<Message>;
}

export interface Chat {
  id: string;
  chatName: string;
  feedback: string;
  rating: number;
}

export interface ChatState {
  chatsList: Array<Chat>;
  chatsContent: chatsContent | null;
  message: Message | null;
  activeChatId: string;
}
