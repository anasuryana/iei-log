
import { Navbar, Nav, Container } from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";
export default function PSINavbar({ userInfo, onShowOffCanvas }) {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" data-bs-theme="dark" >
            <Container fluid>
                <Navbar.Brand href="#home">Logger</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/dashboard">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <Nav.Link >About</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={onShowOffCanvas}>{'Hi ' + userInfo.name}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}