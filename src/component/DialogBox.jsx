import React, {useEffect} from 'react';
import {useState} from "react";
import {Mistral} from "@mistralai/mistralai";


const prompts = {
    "0": "",
    "1": "Génère moi une opération simple de mathématiques (addition, soustraction, multiplication ou division) en français sous la forme (n opération n) pour enfant d'un niveau maximum de CE2 et donne la réponse. Formule la réponse comme ceci :\n" + "Problème : énoncé du calcul\n" + "Réponse : réponse numérique seule, sans justification",
    "2": "Génère une question sur la géométrie en français pour enfant d'un niveau maximum de CE2 et donne la réponse. Formule la réponse comme ceci :\n" + "Problème : énoncé du problème\n" + "Réponse : réponse numérique seule, sans justification",
    "3": "Génère un nouveau problème unique simple de mathématiques en français pour enfant d'un niveau maximum de CE2 et donne la réponse. Formule la réponse comme ceci :\n" + "Problème : énoncé du problème\n" + "Réponse : réponse numérique seule, sans justification",
    "4": ""
}

/**
 * Boite de dialogue utilisé par QT sur l'interface pour intéragir avec l'utilisateur
 * @param gameIndex
 * @param setIsMultipleChoice
 * @param setMultiplesChoices
 * @param setCorrectAnswer
 * @param newProblem
 * @returns {Element}
 * @constructor
 */
export default function DialogBox ({gameIndex, setIsMultipleChoice, setMultiplesChoices, setCorrectAnswer, newProblem}) {
    const [problem, setProblem] = useState("");

    const apiKey = "6xk1gvqX1Vt8nihvZdzcXKkx0T10tcIl";

    const client = new Mistral({apiKey: apiKey});

    useEffect(() => {
        generateProblem().then();
    }, [newProblem])

    const generateProblem = async () => {
        setProblem("...")
        if (gameIndex !== "0") {
            const chatResponse = await client.chat.complete({
                model: "mistral-small",
                messages: [{
                    role: "user",
                    content: prompts[gameIndex]
                }]
            })

            const generatedText = chatResponse.choices[0].message.content;

            const enonce = generatedText.split("Problème :")[1];

            const [question, answer] = enonce.split("Réponse :");

            console.log(`Question : ${question} \n Réponse : ${answer}`);

            setProblem(question.trim());
            setCorrectAnswer(answer.trim());
            /*
            setQtExpression("neutral");
            setFeedback("");
            setUserAnswer("");

             */
        } else {
            setProblem("Apprends les Maths avec QT !")
        }
    };

    return (
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
            {problem}
        </div>
    );

}