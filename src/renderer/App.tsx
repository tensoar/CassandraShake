import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Panel from './components/Panel';
// import icon from '../../assets/icon.svg';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/panel" element={<Panel />} />
            </Routes>
        </Router>
    );
}
