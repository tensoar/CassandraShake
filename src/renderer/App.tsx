import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { MemoryRouter as Router, Routes, Route, BrowserRouter, useSearchParams, HashRouter, MemoryRouter } from 'react-router-dom';

import ConstantUtil from '../main/util/ConstantUtil';
import AddConnection from './components/AddConnection';
import Main from './components/Main';
import Panel from './components/Panel';
import Dispatcher from './Dispatcher';
import ReduxStore from './redux/ReduxStore';

export default function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    useEffect(() => {
        const changeColorCb = (e: any, useDark: boolean) => {
            setColorScheme(__ => useDark ? "dark" : "light");
        }
        ipcRenderer.on(ConstantUtil.ActionChennel.CHANGE_THEME, changeColorCb);
        ipcRenderer.invoke(ConstantUtil.ActionChennel.GET_CURRENT_THEME).then((useDark: boolean) => {
            setColorScheme(__ => useDark ? "dark" : "light");
        });
        return () => {
            ipcRenderer.removeListener(ConstantUtil.ActionChennel.CHANGE_THEME, changeColorCb);
        }
    }, [])

    return (
        <ReduxProvider store={ReduxStore}>
            <MantineProvider theme={{colorScheme: colorScheme as any}}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Dispatcher />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/panel" element={<Panel />} />
                        <Route path='/add_connection' element={<AddConnection />} />
                    </Routes>
                </HashRouter>
            </MantineProvider>
        </ReduxProvider>
    );
}
