import { useEffect } from "react"
import Home from "./Home"

export default function Dashboard({ userInfo }) {

    useEffect(() => {
        if (localStorage.getItem('token')) {
        } else {
            window.location.href = '/'
        }
    }, [])

    return (
        <>
            <Home userInfo={userInfo} />
        </>
    )
}