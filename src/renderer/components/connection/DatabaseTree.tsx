import { useTypedDispath, useTypedSelector } from "../../redux/HooksWrapper";
import Sidebar from "../Sidebar";

export default function DatabaseTree() {
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    return isConnected ?
    <div style={{width: '100%', height: '100%'}}>
        <h3>tree</h3>
    </div>
    :
    <></>
}