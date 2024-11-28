
import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router";
import "bootstrap/dist/js/bootstrap.bundle.js"

export default function PSINavbar({ userInfo, onShowOffCanvas }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed)
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" >
            <Container fluid>
                <Navbar.Brand href="#home">Logger</Navbar.Brand>
                <button onClick={handleNavCollapse} className={`navbar-toggler ${isNavCollapsed ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <NavLink to="/dashboard" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Home
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/ict" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                ICT
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/qpit" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                QPIT
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/about" onClick={handleNavCollapse} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                About
                            </NavLink>
                        </Nav.Item>
                        <Nav.Link onClick={onShowOffCanvas}>{'Hi ' + userInfo.name}</Nav.Link>
                    </Nav>
                </div>
            </Container>
        </Navbar>
    )
}