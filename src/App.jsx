import React, {useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import qtBase from "./assets/qtrobot.png";
import qtThink from "./assets/qtrobot_think.png";
import qtNatural from "./assets/qtrobot_natural.png";

import qtHappy from "./assets/qtrobot_happy.png";
import qtVeryHappy from "./assets/qtrobot_very_happy.png";

import qtSad from "./assets/qtrobot_sad.png";
import qtCry from "./assets/qtrobot_cry.png";

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

const sadExpressions = [qtSad, qtCry]
const happyExpressions = [qtHappy, qtVeryHappy]

export default function App() {
    const [qtExpression, setQtExpression] = useState(qtBase);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [feedback, setFeedback] = useState("");

    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState([]);

    const [idProblem, setIdProblem] = useState(0);

    const [selected, setSelected] = useState("0");

    const problemGenerated = (answer) => {
        setCorrectAnswer(answer)
        if (feedback === "") {
            setQtExpression(qtNatural)
        }
    };

    const nextProblem = (gameIndex, changeExpression = true) => {
        setIdProblem(idProblem + 1);
        if (changeExpression) {
            if (gameIndex === "0") setQtExpression(qtBase)
            else setQtExpression(qtThink);
        }
    };

    function choiceGame(gameIndex) {
        setSelected(gameIndex)
        nextProblem(gameIndex);
    }

    function cleanText(str) {
        if (selected === "1") {
            return Number(str)
        } else
            return str
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\b(un|une|le|la|les|du|de|des|l’|l')\b/g, '')
                .replace(/[^a-z0-9]/g, '')
                .trim();
    }

    const checkAnswer = async (answer) => {
        const isCorrect = cleanText(correctAnswer) === cleanText(answer)
        console.log(`Réponse correcte : ${isCorrect}`);
        if (isCorrect) {
            nextProblem(selected, false);
            setQtExpression(happyExpressions[Math.floor(Math.random() * happyExpressions.length)])
        } else setQtExpression(sadExpressions[Math.floor(Math.random() * sadExpressions.length)]);

        setFeedback(isCorrect ? "TRUE" : "FALSE")
        setTimeout(() => {
            setFeedback("")
            setQtExpression(qtNatural)
        }, 2500)
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
                    <DialogBox gameIndex={selected} newProblem={idProblem} setIsMultipleChoice={setIsMultipleChoice}
                               setMultiplesChoices={setMultipleChoices} setCorrectAnswer={problemGenerated}
                               feedback={feedback}/>
                    <img src={qtExpression} alt="Robot QT"
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