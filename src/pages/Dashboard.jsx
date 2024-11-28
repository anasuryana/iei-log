import { useEffect } from "react"
import { Outlet } from "react-router"


export default function Dashboard({ userInfo }) {

    useEffect(() => {
        if (localStorage.getItem('token')) {
        } else { 
            window.location.href = '/iei'
        }
    }, [])

    return (
        <Outlet />
    )
}