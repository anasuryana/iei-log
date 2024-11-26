import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap"
export default function PSIOffCanvas({ onLoggedIn, showOffCanvas, userInfo, onCloseOffCanvas }) {
    const navigate = useNavigate()
    function handleSignout() {
        if (confirm('Are you sure ?')) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
            axios.delete(import.meta.env.VITE_APP_ENDPOINT + '/users/logout', config)
                .then((response) => {
                    localStorage.removeItem('token')
                    onLoggedIn(false)
                    onCloseOffCanvas()
                    navigate('/')
                }).catch(error => {
                    console.log(error)
                })
        }
    }
    return (
        <Offcanvas show={showOffCanvas} onHide={onCloseOffCanvas} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{userInfo.name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <button className="btn btn-sm btn-danger mb-3" onClick={handleSignout}>Sign out</button><br />
            </Offcanvas.Body>
        </Offcanvas>
    )
}