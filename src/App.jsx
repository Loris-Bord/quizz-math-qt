import React, {useState} from "react";
import {motion} from "framer-motion";
import {Mistral} from '@mistralai/mistralai';
import {FaCalculator, FaShapes, FaPuzzlePiece, FaStopwatch} from "react-icons/fa";
import {Button} from "react-bootstrap";

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

    const apiKey = "nb4MJUeueYbZKVuqEb6If90ZNzRqCb1h";

    const client = new Mistral({apiKey: apiKey});


    const generateProblem = async () => {
        const chatResponse = await client.chat.complete({
            model: "codestral-latest",
            messages: [{
                role: "user",
                content: "Génère un nouveau problème simple de mathématiques pour enfant d'un niveau maximum de CE2 et donne la réponse. Formule la réponse comme ceci :\n" + "Problème : énoncé du problème\n" + "Réponse : réponse numérique"
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
                <button onClick={generateProblem} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Nouvelle
                    Question
                </button>
            </div>
        </div>
    );
}