import { useLocation, useSearchParams } from 'react-router-dom';

export default function Panel() {
    const [searchParams] = useSearchParams();
    const connectionId = searchParams.get('connectionId');

    return (
        <div style={{ height: 'calc(100vh - 90px)', width: '100%', backgroundColor: '#f0f' }}>
            <h2>pannel</h2>
            <h2>{connectionId}</h2>
        </div>
    );
}
