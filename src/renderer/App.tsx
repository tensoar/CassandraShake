import { MemoryRouter as Router, Routes, Route, BrowserRouter, useSearchParams, HashRouter, MemoryRouter } from 'react-router-dom';
import AddConnection from './components/AddConnection';
import Main from './components/Main';
import Panel from './components/Panel';
import Dispatcher from './Dispatcher';
// import icon from '../../assets/icon.svg';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Dispatcher />} />
                <Route path="/main" element={<Main />} />
                <Route path="/panel" element={<Panel />} />
                <Route path='/add_connection' element={<AddConnection />} />
            </Routes>
        </HashRouter>
    );
}
