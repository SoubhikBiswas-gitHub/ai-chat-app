import { Rating } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import bot from "../assets/machine.png";
import user from "../assets/user.png";
import { notifyError } from "../notification";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { AuthorEnum, ChatInteractionStatusEnum, Message } from "../types/chat.type";
import { ThemeEnum } from "../types/util.type";
import FeedbackModal from "./FeedbackModal";

interface ChatProps {
    chatIdProps?: string
}

const Chat: React.FC<ChatProps> = () => {
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

    const currentData = useMemo(() => chatsList?.find((chat) => chat.id === activeChatId), [activeChatId, chatsList]);


    useEffect(() => {
        if (!activeChatId) {
            dispatch(ChatActions.createChat());
        }
    }, []);


    useEffect(() => {
        if (chatsContent && chatsContent[activeChatId]) {
            const activeChatHistory = chatsContent[activeChatId];
            setChatData(
                [...activeChatHistory]
            )
        }
    }, [activeChatId, chatsContent]);

    useEffect(() => {
        const scrollToBottom = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

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
        if (activeChatId && chatsContent && chatsContent[activeChatId]) {
            setChatHistory(chatsContent[activeChatId]);
            setRating(0);
            setFeedback("");
            setShowFeedbackModal(false);
        }
    }, [activeChatId])

    useEffect(() => {
        if (activeChatId) {
            if (currentData && currentData.isEnded) {
                getFeedbackData();
            }
        }
    }, [currentData, activeChatId]);




    const simulateGPTResponse = async (message: string): Promise<string> => {
        try {
            const response = await fetch("http://localhost:5100/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {

                notifyError({ msg: "Error fetching GPT response", theme: themeState === ThemeEnum.LIGHT ? "light" : "dark" });
            }

            const data = await response.json();
            return data.response as string;
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            notifyError({ msg: "Error fetching GPT response", theme: themeState === ThemeEnum.LIGHT ? "light" : "dark" });

            throw error;
        }
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
            dispatch(ChatActions.createChat());
        } else {
            setShowFeedbackModal(false);
        }

    }

    const handleSendFeedback = () => {
        dispatch(ChatActions.updateChatFeedback({ chatId: activeChatId, feedback, rating }));
        setShowFeedbackModal(false);
    };

    const getFeedbackData = () => {
        if (currentData) {
            setFeedback(currentData.feedback)
            setRating(currentData.rating || 0)
        }
    }

    const getChatClass = (type: AuthorEnum) => {
        if (themeState === ThemeEnum.DARK) {
            return type === AuthorEnum.BOT ? "bot-d-p" : "user-d-p";
        } else {
            return type === AuthorEnum.BOT ? "bot-l-p" : "user-l-p";
        }

    }


    return (
        <div className={`new-chat-container box-show-2 ${themeState}-color-panel-3`}>
            <FeedbackModal
                themeState={themeState}
                open={showFeedbackModal}
                sendFeedback={handleSendFeedback}
                handleClose={handleCloseFeedbackModal}
                rating={rating}
                setRating={setRating}
                setFeedback={setFeedback}
                handleNewChatOpen={handleOpenNewChat}
            />
            <div className={`chat-history ${themeState}-color-panel-3`} ref={chatContainerRef}>
                {chatData.map((message, index) => (
                    <div className="msg-all-container">
                        {
                            message.author === AuthorEnum.BOT ?
                                <div className="msg-status">
                                    <span className={`icon ${message.status === ChatInteractionStatusEnum.LIKE ? 'liked' : ''}`} onClick={() => handleChatLike(message.id)}><AiFillLike /></span>
                                    <span className={`icon ${message.status === ChatInteractionStatusEnum.DISLIKE ? 'disliked' : ''}`} onClick={() => handleChatDislike(message.id)}><AiFillDislike /></span>
                                </div> : null
                        }

                        <div key={index} className={`message ${message.author === AuthorEnum.BOT && themeState ? "assistant" : "user"}`}>
                            <div className={`msg-wrapper ${message.author === AuthorEnum.BOT && themeState ? "assistant-wrap" : "user-wrap"}`}>
                                <div className="msg-role">
                                    {message.author === AuthorEnum.BOT ? (
                                        <img src={bot} alt="bot" className="bot" />
                                    ) : (
                                        <img src={user} alt="bot" className="user" />
                                    )}
                                </div>
                                <p className={`msg ${getChatClass(message.author)} `}>{message.content}</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {
                currentData?.isEnded ? chatsList?.some(chat => chat.id === activeChatId) &&
                    <div className="feedback-data">
                        <p className="h-4 feedback-title">Feedback</p>
                        <div className="rating">
                            <Rating name="read-only" value={rating} readOnly />
                        </div>
                        <p className="p-1 feedback-text">{feedback}</p>
                    </div> : null
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
