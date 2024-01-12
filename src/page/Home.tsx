import ChatNavigation from "../components/ChatNavigation"
import ChatWindow from "../components/ChatWindow"

const Home = () => {
    // const chatId = uuid()

    return (
        <div className="home-page-container">
            <ChatNavigation />
            <ChatWindow />
        </div>
    )
}

export default Home