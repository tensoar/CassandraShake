import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import ReduxStore from "./ReduxStore";

type ReduxRootState = ReturnType<typeof ReduxStore.getState>

export const useTypedDispath = () => useDispatch<typeof ReduxStore.dispatch>();
export const useTypedSelector: TypedUseSelectorHook<ReduxRootState> = useSelector;