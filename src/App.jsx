import React, {useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import robotImage from "./assets/qtrobot.png";
import GameChoice from "./component/GameChoice.jsx";
import ResponseBox from "./component/ResponseBox.jsx";
import DialogBox from "./component/DialogBox.jsx";

const categories = [
    {name: "Accueil", color: "#FF00FF"},
    {name: "Calculs", color: "#0091ff"},
    {name: "Géométrie", color: "#09ff00"},
    {name: "Problèmes", color: "#ff0000"},
    {name: "Jeux", color: "#ff8800"},
];

const qtExpressions = {
    neutral: "😀",
    happy: "😃",
    sad: "😢",
};

export default function App() {
    const [qtExpression, setQtExpression] = useState("neutral");
    const [correctAnswer, setCorrectAnswer] = useState("");

    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState([]);

    const [idProblem, setIdProblem] = useState(0);

    const [selected, setSelected] = useState("0");

    const nextProblem = () => setIdProblem(idProblem+1);

    function choiceGame(gameIndex) {
        setSelected(gameIndex)
        nextProblem();
    }

    const checkAnswer = async (answer) => {
        const isCorrect = correctAnswer.toLowerCase().includes(answer);
        console.log(`Réponse correcte : ${isCorrect}`);
        nextProblem();
        //setQtExpression(isCorrect ? "happy" : "sad");
        //setFeedback(isCorrect ? "Correct !" : "Non !!!")
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            minWidth: "100vw",
            background: `linear-gradient(to bottom, ${categories[parseInt(selected)].color} 0%, ${categories[parseInt(selected)].color} 10%, white 80%)`,
            overflow: "hidden",
            userSelect: "none"
        }}>

            <Navbar bg="light" expand="lg" className="w-100">
                <Container fluid className="justify-content-center">
                    <Nav
                        activeKey={selected}
                        onSelect={choiceGame}
                        className="d-flex gap-3 px-4"
                        style={{
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <Nav.Link eventKey="0" className="fw-bold text-center fs-3">Accueil</Nav.Link>
                        <Nav.Link eventKey="1" className="fw-bold text-center fs-3">Calculs</Nav.Link>
                        <Nav.Link eventKey="2" className="fw-bold text-center fs-3">Géométrie</Nav.Link>
                        <Nav.Link eventKey="3" className="fw-bold text-center fs-3">Problèmes</Nav.Link>
                        <Nav.Link eventKey="4" className="fw-bold text-center fs-3">Jeux</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}>
                <div className="flex text-center p-5" style={{
                    flex: 1,
                    overflow: "hidden"
                }}>
                    <DialogBox gameIndex={selected} newProblem={idProblem} setIsMultipleChoice={setIsMultipleChoice} setMultiplesChoices={setMultipleChoices} setCorrectAnswer={setCorrectAnswer}/>
                    <img src={robotImage} alt="Robot QT"
                         style={{
                             position: "absolute",
                             left: "53%",
                             top: "55%",
                             transform: "translate(-50%, -50%)",
                             height: "90vh",
                             objectFit: "contain"
                         }}/>
                </div>

                {selected === "0" ? <GameChoice handleChoiceGame={choiceGame}/> :
                    <ResponseBox isMultipleChoice={isMultipleChoice} multiplesChoices={multipleChoices}
                                 handlerChoice={checkAnswer}/>}
            </div>
        </div>
    );
}