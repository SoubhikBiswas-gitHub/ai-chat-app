import { useAppSelector } from "../redux/store"
import ThemeToggleSwitch from "./ThemeToggleSwitch"

const TopBar = () => {
    const { themeState } = useAppSelector(state => state.util)
    return (
        <div className={`top-bar-container ${themeState}-color-panel-4 } `}>
            <p className="h-2 logo ">Soul.AI</p>
            <div className="top-bar-right">
                <div className="p-2 navigation">
                    Review
                </div>
                <div className="theme-toggle">
                    <ThemeToggleSwitch />
                </div>
            </div>
        </div>
    )
}

export default TopBar