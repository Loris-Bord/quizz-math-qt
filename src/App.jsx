import React, {useEffect, useState} from "react";
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

    /* Pour le jeux chronométré */
    const [timer, setTimer] = useState(30);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [isTimedGame, setIsTimedGame] = useState(false)
    const [nbQuestion, setNbQuestions] = useState(4)
    const [answerHistory, setAnswerHistory] = useState(Array(nbQuestion).fill("neutral"));
    const [timerPaused, setTimerPaused] = useState(false);


    useEffect(() => {
        if (selected === "4" && questionCount < nbQuestion && !gameEnded && !timerPaused) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        handleTimeout();
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [idProblem, selected, gameEnded, timerPaused]);

    useEffect(() => {
        if (selected === '4') setIsTimedGame(true)
        else setIsTimedGame(false)
        setFeedback("");
    }, [selected]);

    useEffect(() => {
        if (questionCount === nbQuestion) setGameEnded(true);
    }, [questionCount]);

    useEffect(() => {
        if (gameEnded) {
            handleQtExpressionByScore(score)
        }
    }, [gameEnded]);

    function handleQtExpressionByScore(score) {
        console.log(qtExpression)
        if (score === 0) {
            setQtExpression(qtCry);
        } else if (score > 0 && score < 0.5 * nbQuestion) {
            setQtExpression(qtSad);
        } else if (score >= 0.5 * nbQuestion && score < 0.75 * nbQuestion) {
            setQtExpression(qtHappy);
        } else if (score >= 0.75 * nbQuestion) {
            setQtExpression(qtVeryHappy);
        }
    }

    const handleTimeout = () => {
        setQtExpression(qtSad);
        setFeedback("FALSE");
        setAnswerHistory(prev => {
            const updated = [...prev];
            updated[questionCount] = "wrong";
            return updated;
        });
        setTimeout(() => {
            setFeedback("");
            setQtExpression(qtNatural);

            setIdProblem(prev => prev + 1);
            setQuestionCount(prev => prev + 1);
            setTimer(30);

        }, 3000);
    };


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
        if (gameIndex === '4') {
            setQuestionCount(0);
            setScore(0);
            setTimer(30);
            setAnswerHistory(Array(nbQuestion).fill("neutral"))
        }
        setGameEnded(false);
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

    const handleSpeechFinished = () => {
        setQtExpression(qtNatural);

        if (selected === "4") { // Jeu chrono
            if (questionCount + 1 >= nbQuestion) {
                setGameEnded(true);
            } else {
                setQuestionCount(prev => prev + 1);
                setTimer(30);
            }
            setTimerPaused(false);
            nextProblem(selected, false);
        } else {
            if (feedback === "TRUE") {
                nextProblem(selected, false);
            }
        }
        setFeedback("");
    };

    const checkAnswer = async (answer) => {
        if (isTimedGame) setTimerPaused(true);
        const isCorrect = cleanText(correctAnswer) === cleanText(answer)
        console.log(`Réponse correcte : ${isCorrect}`);

        if (isCorrect) {
            if (isTimedGame) setScore(prev => prev + 1)
           // nextProblem(selected, false);
            setQtExpression(happyExpressions[Math.floor(Math.random() * happyExpressions.length)])
        } else setQtExpression(sadExpressions[Math.floor(Math.random() * sadExpressions.length)]);

        if (isTimedGame) {
            setAnswerHistory(prev => {
                const updated = [...prev];
                updated[questionCount] = isCorrect ? "correct" : "wrong";
                return updated;
            });

        }

        setFeedback(isCorrect ? "TRUE" : "FALSE")
        // setTimeout(() => {
        //     setFeedback("")
        //     if (!gameEnded) setQtExpression(qtNatural)
        //     if (selected === "4") {
        //         if (questionCount + 1 >= nbQuestion) {
        //             setGameEnded(true);
        //         } else {
        //             //if (!isCorrect) setIdProblem(prev => prev + 1);
        //             setQuestionCount(prev => prev + 1);
        //             setTimer(30);
        //         }
        //         setTimerPaused(false)
        //     }
        // }, 2500)
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
                        <Nav.Link eventKey="4" className="fw-bold text-center fs-3">Jeux chrono</Nav.Link>
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
                               feedback={feedback} timer={timer}
                               onTimeout={handleTimeout}
                               isTimedGame={isTimedGame}
                               gameEnded={gameEnded}
                               score={score}
                               nbQuestion={nbQuestion}
                    onSpeechFinished={handleSpeechFinished}/>

                    {selected === "4" && !gameEnded && (
                        <div style={{
                            position: "absolute",
                            top: "1rem",
                            right: "2rem",
                            fontSize: "2rem",
                            fontWeight: "bold"
                        }}>
                            ⏱️ {timer}s
                        </div>
                    )}

                    {selected === "4" && (
                        <div style={{
                            position: "absolute",
                            top: "6rem",
                            right: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                        }}>
                            {answerHistory.map((status, index) => (
                                <div key={index} style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                        status === "correct" ? "green" :
                                            status === "wrong" ? "red" : "lightgray"
                                }}/>
                            ))}
                        </div>
                    )}


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
                                 handlerChoice={checkAnswer} feedback={feedback}/>}
            </div>
        </div>
    );
}