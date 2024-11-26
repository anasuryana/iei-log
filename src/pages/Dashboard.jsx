import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Home from "./Home"


export default function Dashboard({ userInfo }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
        } else {
            navigate('/')
        }
    }, [])

    return (
        <>
            <Home userInfo={userInfo} />
        </>
    )
}