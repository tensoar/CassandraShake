import { configureStore } from "@reduxjs/toolkit";
import ConnectionReducer from "./reducer/ConnectionReducer";

export default configureStore({
    reducer: {
        connectionState: ConnectionReducer
    }
});
