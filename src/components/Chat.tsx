import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import bot from "../assets/machine.png";
import user from "../assets/user.png";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { AuthorEnum, ChatInteractionStatusEnum, Message } from "../types/chat.type";
import FeedbackModal from "./FeedbackModal";

const Chat: React.FC = () => {
    const dispatch = useAppDispatch();
    const { chatsContent, activeChatId } = useAppSelector(state => state.chat);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [userMessage, setUserMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(ChatActions.setActiveChatId(nanoid()));
    }, [dispatch]);

    const activeChatHistory = chatsContent && chatsContent[activeChatId] ? chatsContent[activeChatId] : [];

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
        setShowFeedbackModal(true);
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
        dispatch(ChatActions.setActiveChatId(nanoid()));

    }

    const handleSendFeedback = () => {
        dispatch(ChatActions.updateChatFeedback({ chatId: activeChatId, feedback, rating }));
        setShowFeedbackModal(false);
    };


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
                {activeChatHistory.map((message, index) => (
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
