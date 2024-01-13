import { Tooltip } from "@mui/joy";
import { nanoid } from "@reduxjs/toolkit";
import { MdArrowForwardIos } from "react-icons/md";
import { Route, Routes } from "react-router-dom";
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
    return (
        <div className={`${isNavigationOpenState ? "chat-window-open" : "chat-window-close"} chat-window-container`}>
            {!isNavigationOpenState ? <div className="sidebar-toggle-switch">
                <div className="chat-navigation-toggle" onClick={toggleNavigation}>
                    <Tooltip title="Open Sidebar" variant="solid">
                        <MdArrowForwardIos />
                    </Tooltip>
                </div>
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