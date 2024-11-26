import axios from "axios";
import { useState } from "react";

import { Offcanvas } from "react-bootstrap"
export default function PSIOffCanvas({ onLoggedIn, showOffCanvas, userInfo, onCloseOffCanvas }) {
    const [isSigning, setIsSigning] = useState(false)
    function handleSignout() {

        if (confirm('Are you sure ?')) {
            setIsSigning(true)
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }
            axios.delete(import.meta.env.VITE_APP_ENDPOINT + '/users/logout', config)
                .then((response) => {
                    setIsSigning(false)
                    localStorage.removeItem('token')
                    onLoggedIn(false)
                    onCloseOffCanvas()
                    window.location.href = '/iei'
                }).catch(error => {
                    console.log(error)
                    setIsSigning(false)
                })
        }
    }
    return (
        <Offcanvas show={showOffCanvas} onHide={onCloseOffCanvas} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{userInfo.name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <button disabled={isSigning} className="btn btn-sm btn-danger mb-3" onClick={handleSignout}>Sign out</button><br />
            </Offcanvas.Body>
        </Offcanvas>
    )
}