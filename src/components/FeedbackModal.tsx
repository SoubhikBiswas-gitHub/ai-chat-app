import { Box, Input, Modal, ModalClose, Sheet } from '@mui/joy';
import { FaRegStar, FaStar } from 'react-icons/fa';
interface FeedbackModalProps {
    open: boolean;
    handleClose: () => void;
    sendFeedback: () => void;
    rating: number;
    setRating: (newRating: number) => void;
    setFeedback: (newFeedback: string) => void;
    handleNewChatOpen: () => void;
}
const FeedbackModal: React.FC<FeedbackModalProps> = ({
    open,
    sendFeedback,
    handleClose,
    rating,
    setRating,
    setFeedback,
    handleNewChatOpen
}) => {


    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={handleClose}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 700,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                }}
            >
                <ModalClose variant="plain" sx={{ m: 1 }} onClick={handleClose} />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "15px 10px",
                        gap: 3,
                    }}
                >
                    <p>Give Feedback</p>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {[1, 2, 3, 4, 5].map((item) => {
                            if (item <= rating) {
                                return (
                                    <FaStar
                                        style={{ color: "var(--yellow-400)", cursor: "pointer" }}
                                        key={item}
                                        onClick={() => setRating(item)}
                                    />
                                );
                            }
                            return (
                                <FaRegStar
                                    style={{ color: "var(--yellow-400)", cursor: "pointer" }}
                                    key={item}
                                    onClick={() => setRating(item)}
                                />
                            );
                        })}
                    </Box>

                    <Input
                        placeholder="Please provide feedback here"
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <button onClick={sendFeedback}>Submit Feedback</button>
                    <button onClick={handleNewChatOpen}>Submit Feedback</button>
                </Box>
            </Sheet>
        </Modal>
    )
}

export default FeedbackModal