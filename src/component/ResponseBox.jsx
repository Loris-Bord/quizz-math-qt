import React from 'react';
import {Button, Form} from "react-bootstrap";


export default function ResponseBox({isMultipleChoice, multiplesChoices, handlerChoice}) {
    const [response, setResponse] = React.useState("");

    return (
        <div className="flex position-absolute w-75" style={{ zIndex: "1000", alignItems:"center", justifyContent: "center", left: "12.25%", bottom: "10%" }}>
            {isMultipleChoice ?
                <>
                    {
                        multiplesChoices.map(choice => (
                            <Button>{choice}</Button>
                        ))
                    }
                </>
                :
                <Form onSubmit={e => {
                    e.preventDefault();
                    handlerChoice(response);
                }} className="mb-3">
                    <Form.Control
                        onChange={e => setResponse(e.target.value)}
                        type="text"
                        placeholder={""}
                        className="border border-primary shadow-sm bg-white"
                        style={{ height: "10vh"}}
                    />
                    <Button type="submit" hidden></Button>
                </Form>
            }
        </div>
    )
}