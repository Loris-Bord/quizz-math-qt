import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";


export default function ResponseBox({isMultipleChoice, multiplesChoices, handlerChoice, feedback}) {
    const [response, setResponse] = React.useState("");

    return (
        <div className="flex position-absolute w-75"
             style={{zIndex: "1000", alignItems: "center", justifyContent: "center", left: "12.25%", bottom: "10%"}}>
            {isMultipleChoice ?
                <>
                    <Container className="text-center mt-5">
                        <Row className="mb-3">
                            {
                                multiplesChoices.slice(0, 2).map(choice => (
                                    <Col>
                                        <Button onClick={() => handlerChoice(choice)} variant="primary" className="w-100 py-4">{choice}</Button>
                                    </Col>
                                ))
                            }
                        </Row>
                        <Row>
                            {
                                multiplesChoices.slice(2, 4).map(choice => (
                                    <Col>
                                        <Button onClick={() => handlerChoice(choice)} variant="primary" className="w-100 py-4">{choice}</Button>
                                    </Col>
                                ))
                            }
                        </Row>
                    </Container>
                </>
                :
                <Form onSubmit={e => {
                    e.preventDefault();
                    handlerChoice(response);
                    setResponse("");
                }} className="mb-3">
                    <Form.Control
                        onChange={e => setResponse(e.target.value)}
                        type="text"
                        value={response}
                        placeholder={""}
                        className="border border-primary shadow-sm bg-white"
                        style={{height: "10vh"}}
                        disabled={feedback !== ''}
                    />
                    <Button type="submit" hidden></Button>
                </Form>
            }
        </div>
    )
}