import React, {useState} from "react";
import {Container, Navbar, Nav, Button, Row, Col, Card} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Mistral} from '@mistralai/mistralai';
import robotImage from "./assets/qtrobot.png";
import {FaCalculator, FaShapes, FaPuzzlePiece, FaStopwatch} from "react-icons/fa";
import SalEnculer from "./component/SalEnculer.jsx";

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
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [problem, setProblem] = useState({question: "Chargement de la question...", answer: ""});

    const [selected, setSelected] = useState("0");

    const apiKey = "6xk1gvqX1Vt8nihvZdzcXKkx0T10tcIl";

    const client = new Mistral({apiKey: apiKey});


    const generateProblem = async () => {
        const chatResponse = await client.chat.complete({
            model: "mistral-small",
            messages: [{
                role: "user",
                content: "Génère un nouveau problème unique simple de mathématiques en français pour enfant d'un niveau maximum de CE2 et donne la réponse. Formule la réponse comme ceci :\n" + "Problème : énoncé du problème\n" + "Réponse : réponse numérique seule, sans justification"
            }],
        })

        const generatedText = chatResponse.choices[0].message.content;

        const enonce = generatedText.split("Problème :")[1];

        const [question, answer] = enonce.split("Réponse :");

        console.log(`Question : ${question} \n Réponse : ${answer}`);

        setProblem({question: question.trim(), answer: answer.trim()});
        setQtExpression("neutral");
        setFeedback("");
        setUserAnswer("");

    };

    const checkAnswer = async () => {
        const isCorrect = problem.answer.toLowerCase().includes(userAnswer);
        setQtExpression(isCorrect ? "happy" : "sad");
        setFeedback(isCorrect ? "Correct !" : "Non !!!")
    };



    React.useEffect(() => {
        //generateProblem();
    }, []);

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
                            onSelect={setSelected}
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
                    <div style={{
                        position: "absolute",
                        top: "30%",
                        left: "25%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "5rem 2rem",
                        borderRadius: "15px",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        zIndex: "1",
                    }}>
                        Apprends les Maths avec QT !
                    </div>
                    <img src={robotImage} alt="Robot QT"
                         style={{ position: "absolute", left: "53%", top: "55%", transform: "translate(-50%, -50%)", height: "90vh", objectFit: "contain" }} />
                    </div>

                    {selected === "0" && <SalEnculer handleChoiceGame={setSelected}/>}
                </div>
        </div>
    );
}