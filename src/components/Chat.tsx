import { Rating } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import bot from "../assets/machine.png";
import user from "../assets/user.png";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { AuthorEnum, ChatInteractionStatusEnum, Message } from "../types/chat.type";
import FeedbackModal from "./FeedbackModal";
import { notifyError } from "../notification";
import { ThemeEnum } from "../types/util.type";

interface ChatProps {
    chatIdProps?: string
}

const Chat: React.FC<ChatProps> = ({
    chatIdProps
}) => {
    const dispatch = useAppDispatch();
    const { themeState } = useAppSelector(state => state.util);
    const { chatsContent, activeChatId, chatsList } = useAppSelector(state => state.chat);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [userMessage, setUserMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const [chatData, setChatData] = useState<Array<Message>>([]);



    useEffect(() => {
        dispatch(ChatActions.setActiveChatId(nanoid()));
    }, [dispatch, chatIdProps]);

    // const activeChatHistory = chatsContent && chatsContent[activeChatId] ? chatsContent[activeChatId] : [];

    useEffect(() => {
        if (chatsContent && chatsContent[activeChatId]) {
            const activeChatHistory = chatsContent[activeChatId];
            console.log("activeChatHistory", activeChatHistory);
            setChatData(
                [...activeChatHistory]
            )
        }
    }, [activeChatId, chatsContent]);

    useEffect(() => {
        const scrollToBottom = () => {
            const container = chatContainerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        };
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        if (activeChatId) {
            const updatedChatsContent = { ...chatsContent, [activeChatId]: chatHistory };
            dispatch(ChatActions.setChatsContent(updatedChatsContent));
        }
    }, [chatHistory, activeChatId, dispatch]);


    useEffect(() => {
        setChatHistory([]);
        setRating(0);
        setFeedback("");
        setShowFeedbackModal(false);
    }, [activeChatId])


    let callCount = 0;
    const simulateGPTResponse = async (message: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        callCount += 1;

        if (callCount % 3 === 0) {
            throw new Error("Simulated API failure");
        }
        return `Response to ${message}`;
    };

    const sendMessage = async () => {
        if (chatLoading || !userMessage.trim()) return;

        setChatLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        const newUserMessage = {
            id: nanoid(),
            author: AuthorEnum.USER,
            content: userMessage,
            status: ChatInteractionStatusEnum.NO_INTERACTION,
        };
        setChatHistory(prevHistory => [...prevHistory, newUserMessage]);
        setUserMessage("");


        try {
            const gptResponse = await simulateGPTResponse(userMessage);
            const botMessage = {
                id: nanoid(),
                author: AuthorEnum.BOT,
                content: gptResponse,
                status: ChatInteractionStatusEnum.NO_INTERACTION,
            };
            setChatHistory(prevHistory => [...prevHistory, botMessage]);

        } catch (error) {
            console.error("Error sending message to GPT API:", error);
        } finally {
            setChatLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const handleChatEnd = () => {
        if (chatData && chatData.length > 0) {
            setShowFeedbackModal(true);
        } else {
            notifyError({ msg: "Please start a new chat first", theme: themeState === ThemeEnum.LIGHT ? "light" : "dark" });
        }
    }
    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
    }

    const handleChatLike = (messageId: string) => {
        dispatch(ChatActions.setLikeMessage({ chatId: activeChatId, messageId }));
        console.log("found-like", messageId, chatHistory);
    };

    const handleChatDislike = (messageId: string) => {
        dispatch(ChatActions.setDislikeMessage({ chatId: activeChatId, messageId }));
        console.log("found-dislike", messageId, chatHistory);
    };

    const handleOpenNewChat = () => {
        const data = confirm("Are you sure you want to start a new chat?  You will be lost your current chat history. To save your current chat history end the chat first");
        if (data) {
            dispatch(ChatActions.setActiveChatId(nanoid()));
        } else {
            setShowFeedbackModal(false);
        }

    }

    const handleSendFeedback = () => {
        dispatch(ChatActions.updateChatFeedback({ chatId: activeChatId, feedback, rating }));
        setShowFeedbackModal(false);
    };

    const getFeedbackData = () => {
        const currentData = chatsList?.find((chat) => chat.id === activeChatId)
        if (currentData) {
            setFeedback(currentData.feedback)
            setRating(currentData.rating)
        }
    }

    useEffect(() => {
        getFeedbackData()
    }, [])


    return (
        <div className="new-chat-container">
            <FeedbackModal
                open={showFeedbackModal}
                sendFeedback={handleSendFeedback}
                handleClose={handleCloseFeedbackModal}
                rating={rating}
                setRating={setRating}
                setFeedback={setFeedback}
                handleNewChatOpen={handleOpenNewChat}
            />
            <div className="chat-history" ref={chatContainerRef}>
                {chatData.map((message, index) => (
                    <div key={index} className={`message ${message.author === AuthorEnum.BOT ? "assistant" : "user"}`}>
                        <div className={`msg-wrapper `}>
                            <div className="msg-role">
                                {message.author === AuthorEnum.BOT ? (
                                    <img src={bot} alt="bot" className="bot" />
                                ) : (
                                    <img src={user} alt="bot" className="user" />
                                )}
                            </div>
                            <p className="msg">{message.content}</p>
                        </div>
                        {
                            message.author === AuthorEnum.BOT ?
                                <div className="msg-status">
                                    <span className={`icon ${message.status === ChatInteractionStatusEnum.LIKE ? 'liked' : ''}`} onClick={() => handleChatLike(message.id)}><AiFillLike /></span>
                                    <span className={`icon ${message.status === ChatInteractionStatusEnum.DISLIKE ? 'disliked' : ''}`} onClick={() => handleChatDislike(message.id)}><AiFillDislike /></span>
                                </div> : null
                        }
                    </div>
                ))}
            </div>

            {
                chatsList?.some(chat => chat.id === activeChatId) &&
                <div className="feedback-data">
                    <p className="h-4 feedback-title">Feedback</p>
                    <div className="rating">
                        <Rating name="read-only" value={rating} readOnly />
                    </div>
                    <p className="p-1 feedback-text">{feedback}</p>
                </div>
            }

            <div className="input-container">
                <input
                    className="input-field"
                    ref={inputRef}
                    type="text"
                    value={userMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserMessage(e.target.value)}
                    placeholder={chatLoading ? "Loading..." : "Type a message..."}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage} disabled={chatLoading} className="send-btn">
                    {chatLoading ? <span className="loader"></span> : "Send"}
                </button>
                <button onClick={handleChatEnd} disabled={chatLoading} className="end-btn">
                    End Chat
                </button>
            </div>

        </div>
    );
};

export default Chat;
