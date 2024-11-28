
import '../home.css'
import { Badge, Button, Container, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Home({ userInfo }) {
    return (
        <Container fluid>
            {
                userInfo.name.includes('init') ? userInfo.name : <h1>Welcome 🤝</h1>
            }
        </Container>
    )
}
