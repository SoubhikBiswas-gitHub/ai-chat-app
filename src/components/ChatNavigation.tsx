import { Tooltip } from "@mui/joy";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { MdArrowBackIosNew } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { UtilActions } from "../redux/util.slice";



const ChatNavigation = () => {
    const dispatch = useAppDispatch();
    const { themeState, isNavigationOpenState } = useAppSelector(state => state.util);
    const { chatsList } = useAppSelector(state => state.chat);
    const [editingChatId, setEditingChatId] = useState<string>('');
    const [editedName, setEditedName] = useState<string>('');

    const toggleNavigation = () => {
        dispatch(UtilActions.setIsNavigationOpenState(!isNavigationOpenState));
    };

    const handleOpenNewChat = () => {
        dispatch(ChatActions.setActiveChatId(nanoid()));
    };

    const editChatName = (chatId: string, chatName: string) => {
        setEditingChatId(chatId);
        setEditedName(chatName);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const saveEditedName = (chatId: string) => {
        dispatch(ChatActions.updateChatName({ chatId, chatName: editedName }));
        setEditingChatId('');
    };

    const handleOpenChat = (chatId: string) => {
        dispatch(ChatActions.setActiveChatId(chatId));
    }

    return (
        <div className={`chat-navigation-container ${themeState}-color-panel-4 ${isNavigationOpenState ? "chat-navigation-open" : "chat-navigation-close"}`}>
            <div className="navigation-container">

                <Tooltip
                    size={"sm"}
                    variant={"plain"}
                    title={"Hide Sidebar"}
                >
                    <div className="controller" onClick={toggleNavigation}>
                        <span className="text">Hide Sidebar</span>
                        <MdArrowBackIosNew />

                    </div>
                </Tooltip>
                <Tooltip
                    size={"sm"}
                    variant={"plain"}
                    title={"Create new chat"}
                >
                    <div className="controller" onClick={handleOpenNewChat}>
                        <span className="text">Create New Chat</span>
                        <IoIosCreate />

                    </div>
                </Tooltip>
            </div>
            {chatsList.length > 0 ? <div className="all-chats">
                <p className="h-4 text">All Chats</p>
                {

                    <div className="all-chats">
                        {chatsList?.map((chat, index) => (
                            <div key={index} className="chat-name" onClick={() => handleOpenChat(chat.id)}>
                                {editingChatId === chat.id ? (
                                    <div className="name">
                                        <input
                                            className="input"
                                            type="text"
                                            value={editedName}
                                            onChange={handleNameChange}
                                        />
                                        <div className="icons">
                                            <span className="icon" onClick={() => setEditingChatId('')}>
                                                <FaCheck color="green" />
                                            </span>
                                            <span className="icon" onClick={() => saveEditedName(chat.id)}>
                                                <RxCross2 color="red" size={18} />
                                            </span>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="name">
                                        <span className="icon" onClick={() => editChatName(chat.id, chat.chatName)}>
                                            <AiFillEdit />
                                        </span>
                                        <span className="text">{chat.chatName}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                }
            </div> : <p className="h-4 text-no-chat">No Chats Found</p>
            }
        </div>
    )
}

export default ChatNavigation