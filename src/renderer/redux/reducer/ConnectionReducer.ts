import { createSlice } from "@reduxjs/toolkit";
import { Client } from "cassandra-driver";

type ConnectionState = {
    isConnected: boolean,
    connectionId: number,
    client: Client | null
}

type ConnectionReducer = {
    connectAction: (state: ConnectionState, payload: {payload: Client, type: string}) => void,
    disConnectionAction: (state: ConnectionState) => void,
    setConnectionIdAction: (state: ConnectionState, payload: {payload: number, type: string}) => void
}

export const ConnectionStateSlice = createSlice<ConnectionState, ConnectionReducer, 'ConnectionState'>({
    name: 'ConnectionState',
    initialState: {
        isConnected: false,
        connectionId: -1,
        client: null
    },
    reducers: {
        connectAction: (state, payload) => {
            state.isConnected = true;
            state.client = payload.payload;
        },
        disConnectionAction: state => {
            if (state.client != null) {
                try {
                    state.client.shutdown();
                // eslint-disable-next-line no-empty
                } catch (ignore) {}
            }
            state.isConnected = false;
        },
        setConnectionIdAction: (state, payload) => {
            state.connectionId = payload.payload;
        }
    }
});

export const { connectAction, disConnectionAction, setConnectionIdAction } = ConnectionStateSlice.actions;
export default ConnectionStateSlice.reducer;
