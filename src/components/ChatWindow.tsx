import { Tooltip } from "@mui/joy";
import { nanoid } from "@reduxjs/toolkit";
import { IoIosCreate } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { Route, Routes } from "react-router-dom";
import { ChatActions } from "../redux/chat.slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { UtilActions } from "../redux/util.slice";
import Chat from "./Chat";

const ChatWindow = () => {
    const chatId = nanoid();
    const { isNavigationOpenState } = useAppSelector(state => state.util);
    const dispatch = useAppDispatch();
    const toggleNavigation = () => {
        dispatch(
            UtilActions.setIsNavigationOpenState(!isNavigationOpenState)
        )
    }

    const handleOpenNewChat = () => {
        dispatch(ChatActions.setActiveChatId(nanoid()));
    }
    return (
        <div className={`chat-window-container ${!isNavigationOpenState ? "full-width" : ""} `}>
            {!isNavigationOpenState ?
                <div className="sidebar-switch">
                    <Tooltip
                        size={"sm"}
                        variant={"plain"}
                        title={"Show Sidebar"}
                    >
                        <div className="icon toggle-sidebar" onClick={toggleNavigation}>

                            <MdArrowForwardIos />

                        </div>
                    </Tooltip>
                    <Tooltip
                        size={"sm"}
                        variant={"plain"}
                        title={"Create new chat"}
                    >
                        <div className="icon open-new-chat" onClick={handleOpenNewChat}>

                            <IoIosCreate />

                        </div>
                    </Tooltip>
                </div> : null}
            <div className={`chat-container ${isNavigationOpenState ? "open" : "close"}`}>
                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path={`/chat/${chatId}`} element={<Chat />} />
                </Routes>
            </div>
        </div>
    )
}

export default ChatWindow