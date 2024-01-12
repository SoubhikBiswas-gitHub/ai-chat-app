import { Tooltip } from "@mui/joy";
import { MdArrowBackIosNew } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/stote";
import { UtilActions } from "../redux/util.slice";

const ChatNavigation = () => {
    const { themeState, isNavigationOpenState } = useAppSelector(state => state.util);
    const dispatch = useAppDispatch();
    const toggleNavigation = () => {
        dispatch(
            UtilActions.setIsNavigationOpenState(!isNavigationOpenState)
        )
    }

    return (
        <div className={`chat-navigation-container ${themeState}-color-panel-4 ${isNavigationOpenState ? "chat-navigation-open" : "chat-navigation-close"}`}>
            <div className="chat-navigation-toggle" onClick={toggleNavigation}>
                <Tooltip title="Close Sidebar" variant="solid" >
                    <MdArrowBackIosNew />
                </Tooltip>
            </div>
        </div>
    )
}

export default ChatNavigation