import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home'
import { Feedback } from '../page/FeedBack'

const AppRouter = () => {

    return (
        <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/feedback" element={<Feedback />} />
        </Routes>
    )
}

export default AppRouter