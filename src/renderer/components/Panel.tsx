import { Button } from '@mantine/core';
import { ipcRenderer } from 'electron';
import { useLocation, useSearchParams } from 'react-router-dom';

import ConstantUtil from '../../main/util/ConstantUtil';

export default function Panel() {
    const [searchParams] = useSearchParams();
    const connectionId = parseInt(searchParams.get('connectionId') || '0', 10);

    const closeConnection = async () => {
        const focusId = await ipcRenderer.invoke(ConstantUtil.BVIpcChannel.REMOVE, connectionId) as number;
        console.log('focus id = ', focusId);
    }

    return (
        <div style={{ height: 'calc(100vh - 90px)', width: '100%', backgroundColor: '#FAFBFC' }}>
            <h2>pannel</h2>
            <h2>{connectionId}</h2>
            <Button onClick={closeConnection}>关闭</Button>
        </div>
    );
}
