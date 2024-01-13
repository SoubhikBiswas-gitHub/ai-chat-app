import { Box } from "@mui/material";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAppSelector } from "../redux/store";
import { Chat } from "../types/chat.type";



export const Feedback: React.FC = () => {
    const { chatsList } = useAppSelector((state) => state.chat);
    const { themeState } = useAppSelector((state) => state.util)
    const sortedMsgList = chatsList.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return (
        <div className={`feedback-page ${themeState}-color-panel-1`}>
            <Box className="feedback">
                <h1 className="h-1 text-center">Feedback</h1>
                <ul className="feedback-list-container">
                    <li className="feedback-list-header">
                        <p className="p-3 text">Name</p>
                        <p className="p-3 text">Rating</p>
                        <p className="p-3 text">Feedback</p>
                    </li>
                    {sortedMsgList.map((msg: Chat) => (
                        <li key={msg.id} className="feedback-list-item">
                            <p className="p-3">{msg.chatName}</p>
                            <p className="rating">
                                {msg.rating !== null
                                    ? Array.from({ length: 5 }, (_, index) => (
                                        <span key={index}>{index + 1 <= (msg.rating || 0) ? <FaStar /> : <FaRegStar />}</span>
                                    ))
                                    : "not rated"}
                            </p>
                            <p className="p-3 last">{msg.feedback}</p>
                        </li>
                    ))}
                </ul>
            </Box>
        </div>
    );
};
