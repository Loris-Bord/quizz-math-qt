import React, {useState} from "react";
import {motion} from "framer-motion";
import {Container, Navbar, Nav, Button, Row, Col, Card} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Mistral} from '@mistralai/mistralai';
import robotImage from "./assets/qtrobot.png";
import {FaCalculator, FaShapes, FaPuzzlePiece, FaStopwatch} from "react-icons/fa";

const categories = [
    {name: "Nombres et calculs", icon: <FaCalculator/>, color: "bg-blue-500"},
    {name: "Géométrie", icon: <FaShapes/>, color: "bg-green-500"},
    {name: "Problèmes et logique", icon: <FaPuzzlePiece/>, color: "bg-red-500"},
    {name: "Jeux chronométrés", icon: <FaStopwatch/>, color: "bg-orange-500"},
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
        generateProblem();
    }, []);

    return (
        <>
            <div style={{width: "100vw", height: "100vh", overflow: "auto"}}>
                {/* Navigation Bar */}
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="#">Apprendre les Maths</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#">Accueil</Nav.Link>
                                <Nav.Link href="#">Nombres</Nav.Link>
                                <Nav.Link href="#">Géométrie</Nav.Link>
                                <Nav.Link href="#">Problèmes</Nav.Link>
                                <Nav.Link href="#">Jeux chrono</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Header Section */}
                <div className="text-center p-5" style={{background: "linear-gradient(to bottom, #ff00ff, white)"}}>
                    <img src={robotImage} alt="Robot QT" style={{maxWidth: "250px"}}/>
                    <h2 className="mt-3">Apprends les Maths avec QT !</h2>
                </div>

                {/* Categories Section */}
                <Container className="mt-4 text-center">
                    <Row>
                        <Col md={3} sm={6} className="mb-3">
                            <Card style={{backgroundColor: "#4b91f1", color: "white"}}>
                                <Card.Body>
                                    <Card.Title>8</Card.Title>
                                    <Card.Text>Nombres et calculs</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                            <Card style={{backgroundColor: "#4caf50", color: "white"}}>
                                <Card.Body>
                                    <Card.Title>&#9650;</Card.Title>
                                    <Card.Text>Géométrie</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                            <Card style={{backgroundColor: "#f44336", color: "white"}}>
                                <Card.Body>
                                    <Card.Title>&#8801;</Card.Title>
                                    <Card.Text>Problèmes et logique</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                            <Card style={{backgroundColor: "#ff9800", color: "white"}}>
                                <Card.Body>
                                    <Card.Title>:2</Card.Title>
                                    <Card.Text>Jeux chronométrés</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
    /*
    return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-white p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Problèmes et Logique</h1>

        <motion.div animate={{scale: 1.1}} className="text-7xl mb-4">
            {qtExpressions[qtExpression]}
        </motion.div>

        <Button variant="secondary" onClick={checkAnswer}>
            EH218EJ1I
        </Button>

        <div className="bg-white p-4 rounded-xl shadow-lg max-w-lg mx-auto">
            <p className="text-lg font-semibold mb-4">{problem.question}</p>
            <input
                type="text"
                className="border p-2 rounded w-full mb-2"
                placeholder="Ta réponse..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
            />
            <button onClick={checkAnswer} className="bg-blue-500 text-white px-4 py-2 rounded">Vérifier</button>
            {feedback && <p className="mt-2 font-semibold">{feedback}</p>}
            <button onClick={generateProblem}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2">Nouvelle
                Question
            </button>
        </div>
    </div>
    );

    */
}