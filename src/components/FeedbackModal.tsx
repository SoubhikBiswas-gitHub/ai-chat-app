import { Box, Input, Modal, ModalClose, Sheet } from "@mui/joy";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ThemeEnum } from "../types/util.type";

interface FeedbackModalProps {
    open: boolean;
    sendFeedback: () => void;
    handleClose: () => void;
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
    handleNewChatOpen: () => void
    themeState: ThemeEnum
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    open,
    sendFeedback,
    handleClose,
    rating,
    setRating,
    setFeedback,
    handleNewChatOpen,
    themeState
}) => {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={handleClose}
            className="modal-container"
        >
            <Sheet variant="outlined"


                className={`sheet-container ${themeState}-color-panel-1`}>
                <ModalClose variant="plain" className="modal-close" onClick={handleClose} />
                <Box className={`box-container `}>
                    <p className="p-1 text">Give Feedback</p>
                    <Box className="star-container">
                        {[1, 2, 3, 4, 5].map((item) => {
                            return (
                                <span
                                    key={item}
                                    className={`star ${item <= rating ? 'selected' : ''}`}
                                    onClick={() => setRating(item)}
                                >
                                    {item <= rating ? <FaStar /> : <FaRegStar />}
                                </span>
                            );
                        })}
                    </Box>

                    <Input
                        className="feedback-input"
                        placeholder="Please provide feedback here"
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div className="button-container">
                        <button className="submit-button" onClick={sendFeedback}>
                            Submit Feedback
                        </button>
                        <button className="new-chat-button" onClick={handleNewChatOpen}>
                            Open New Chat
                        </button>
                    </div>
                </Box>
            </Sheet>
        </Modal>
    );
};

export default FeedbackModal;
