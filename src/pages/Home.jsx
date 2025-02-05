
import '../home.css'
import { Container } from "react-bootstrap"

export default function Home({ userInfo }) {
    return (
        <Container fluid>
            {
                userInfo.name.includes('init') ? userInfo.name : <h1>Welcome 🤝</h1>
            }
        </Container>
    )
}
