import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import bot from "../assets/machine.png";
import user from "../assets/user.png";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/stote";
import { AuthorEnum, ChatInteractionStatusEnum, Message } from "../types/chat.type";

const Chat: React.FC = () => {
    const [userMessage, setUserMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { chatsContent, activeChatId } = useAppSelector(state => state.chat);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        dispatch(ChatActions.setActiveChatId(nanoid()));
    }, [dispatch]);

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        if (activeChatId) {
            const updatedChatsContent = { ...chatsContent, [activeChatId]: chatHistory };
            dispatch(ChatActions.setChatsContent(updatedChatsContent));
        }
    }, [chatHistory, activeChatId, dispatch]);


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
                status: ChatInteractionStatusEnum.LIKE,
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

    return (
        <div className="chat-container">
            <p className="welcome-msg">Welcome to the chat!</p>

            <div className="chat-history" ref={chatContainerRef}>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`message ${message.author}`}>
                        <div className="msg-wrapper">
                            <div className="msg-role">
                                {message.author === AuthorEnum.BOT ? (
                                    <img src={bot} alt="bot" className="bot" />
                                ) : (
                                    <img src={user} alt="bot" className="user" />
                                )}
                            </div>
                            <p className="msg">{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    ref={inputRef}
                    type="text"
                    value={userMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserMessage(e.target.value)}
                    placeholder={chatLoading ? "Loading..." : "Type a message..."}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage} disabled={chatLoading}>
                    {chatLoading ? <span className="loader"></span> : "Send"}
                </button>
            </div>
        </div>
    );
};

export default Chat;
