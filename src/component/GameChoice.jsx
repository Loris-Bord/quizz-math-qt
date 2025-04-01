import React from "react";
import {Card, Col, Container, Row} from "react-bootstrap";


export default function GameChoice({handleChoiceGame}) {
    return (
        <Container fluid className="text-center" style={{
            padding: "1rem",
            position: "absolute",
            bottom: "0",
            background: "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 65% ,rgba(255, 255, 255, 0)) 100%",
            zIndex: 1000
        }}>
            <Row className="justify-content-center" style={{
                display: "flex",
                flexWrap: "wrap"
            }}>
                <Col className="d-flex justify-content-center">
                    <Card className="card-button text-white text-center"
                          style={{ backgroundColor: "#4b91f1",
                              cursor: "pointer",
                              color: "white",
                              width: "25vh",
                              height: "25vh"}}
                          onClick={() => handleChoiceGame("1")}>
                        <Card.Body className={"d-flex flex-column justify-content-center align-items-center"}>
                            <Card.Title className={"fs-1 fw-bolder"}>8</Card.Title>
                            <Card.Text className={"fs-2 fw-bolder"}>Nombres et calculs</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Card className="card-button text-white text-center"
                          style={{backgroundColor: "#4caf50", cursor: "pointer", color: "white",  width: "25vh",
                              height: "25vh",}}
                          onClick={() => handleChoiceGame("2")}>
                        <Card.Body className={"d-flex flex-column justify-content-center align-items-center"}>
                            <Card.Title className={"fs-1 fw-bolder"}>&#9650;</Card.Title>
                            <Card.Text className={"fs-2 fw-bolder"}>Géométrie</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Card className="card-button text-white text-center"
                          style={{backgroundColor: "#f44336", cursor: "pointer", color: "white",  width: "25vh",
                              height: "25vh"}}
                          onClick={() => handleChoiceGame("3")}>
                        <Card.Body className={"d-flex flex-column justify-content-center align-items-center"}>
                            <Card.Title className={"fs-1 fw-bolder"}>|=</Card.Title>
                            <Card.Text  className={"fs-2 fw-bolder"}>Problèmes et logique</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Card className="card-button text-white text-center"
                          style={{backgroundColor: "#ff9800", cursor: "pointer", color: "white",  width: "25vh",
                              height: "25vh",}}
                          onClick={() => handleChoiceGame("4")}>
                        <Card.Body className={"d-flex flex-column justify-content-center align-items-center"}>
                            <Card.Title className={"fs-1 fw-bolder"}>10:00</Card.Title>
                            <Card.Text  className={"fs-2 fw-bolder"}>Jeux chronométrés</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}