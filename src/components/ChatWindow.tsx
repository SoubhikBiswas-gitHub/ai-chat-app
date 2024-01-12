import { Tooltip } from "@mui/joy";
import { MdArrowForwardIos } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/stote";
import { UtilActions } from "../redux/util.slice";

const ChatWindow = () => {
    const { isNavigationOpenState } = useAppSelector(state => state.util);
    const dispatch = useAppDispatch();
    const toggleNavigation = () => {
        dispatch(
            UtilActions.setIsNavigationOpenState(!isNavigationOpenState)
        )
    }
    return (
        <div className="chat-window-container">
            {!isNavigationOpenState ? <div className="sidebar-toggle-switch">
                <div className="chat-navigation-toggle" onClick={toggleNavigation}>
                    <Tooltip title="Open Sidebar" variant="solid">
                        <MdArrowForwardIos />
                    </Tooltip>
                </div>
            </div> : null}
        </div>
    )
}

export default ChatWindow