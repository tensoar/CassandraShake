import { Navigate, useSearchParams } from "react-router-dom";

export default function Dispatcher() {

    const [searchParams] = useSearchParams();
    const pathName = searchParams.get("pathName") as string;

    return <Navigate replace to={{
        pathname: pathName,
        search: searchParams.toString()
    }} />;
}