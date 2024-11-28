
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router";

export default function PSINavbar({ userInfo, onShowOffCanvas }) {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" data-bs-theme="dark" >
            <Container fluid>
                <Navbar.Brand href="#home">Logger</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Home
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/ict" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                ICT
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/qpit" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                QPIT
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/dashboard/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                About
                            </NavLink>
                        </Nav.Item>
                        <Nav.Link onClick={onShowOffCanvas}>{'Hi ' + userInfo.name}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}