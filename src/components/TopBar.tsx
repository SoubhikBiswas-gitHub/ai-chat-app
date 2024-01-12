import ThemeToggleSwitch from "./ThemeToggleSwitch"

const TopBar = () => {
    return (
        <div className="top-bar-container">
            <p className="logo">Soul.AI</p>
            <div className="navigation">
                Review
            </div>
            <div className="theme-toggle">
                <ThemeToggleSwitch />
            </div>
        </div>
    )
}

export default TopBar