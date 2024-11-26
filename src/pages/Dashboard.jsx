import { useEffect } from "react"
import Home from "./Home"

export default function Dashboard({ userInfo }) {

    useEffect(() => {
        if (localStorage.getItem('token')) {
        } else {
            window.location.href = '/iei'
        }
    }, [])

    return (
        <>
            <Home userInfo={userInfo} />
        </>
    )
}