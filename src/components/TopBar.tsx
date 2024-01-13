import { MdOutlineHome } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import ThemeToggleSwitch from "./ThemeToggleSwitch";

const TopBar = () => {
    const { themeState } = useAppSelector(state => state.util)
    const navigate = useNavigate();
    const location = useLocation()
    const handleNavigate = () => {
        const newPath = location.pathname === '/feedback' ? '/' : '/feedback';
        navigate(newPath);
    }
    const handleNavigateHome = () => {
        navigate('/');
    }

    return (
        <div className={`top-bar-container box-show-2 ${themeState}-color-panel-2 } `}>
            <p className="h-2 logo " onClick={handleNavigateHome}>Soul.AI</p>
            <div className="top-bar-right">
                <div className="p-2 navigation" onClick={handleNavigate}>
                    {location.pathname === '/feedback' ?
                        <span className="text"><MdOutlineHome size={18} /> Home</span> :
                        <span className="text"><TiDocumentText size={18} />Review
                        </span>

                    }
                </div>
                <div className="theme-toggle">
                    <ThemeToggleSwitch />
                </div>
            </div>
        </div>
    )
}

export default TopBar