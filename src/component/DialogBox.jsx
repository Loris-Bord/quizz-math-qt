import React, {useEffect, useRef} from 'react';
import {useState} from "react";
import {Mistral} from "@mistralai/mistralai";


const prompts = {
    "0": "",
    "1": `Génère une **nouvelle opération de mathématiques différente** à chaque fois pour un élève de CE2. Varie les nombres et les opérateurs (+, -, ×), utilise des nombres inférieurs à 50, pour les multiplications utilise seulement des nombres inférieurs à 10, ne fait pas de division, sans jamais répéter un exercice déjà généré. 
            Retourne uniquement le texte sous ce format EXACT :

            Problème : [énoncé du calcul sous forme "n opération n"]
            Réponse : [réponse numérique]
            GoodResponse : [petite phrase d'encouragement si l'enfant a réussi]
            BadResponse : [petite phrase d'encouragement si l'enfant s'est trompé, ne donne pas la réponse]
            
            Ne génère **qu’un seul** exercice.`,

    "2": `Génère une **nouvelle question sur la géométrie en français différente à chaque fois** pour enfant d'un niveau maximum de CE2.
            Retourne uniquement le texte sous ce format EXACT :
            
            Problème : [énoncé]
            Réponse : [réponse en un seul mot]
            GoodResponse : [petite phrase d'encouragement si l'enfant a réussi]
            BadResponse : [petite phrase d'encouragement si l'enfant s'est trompé,ne donne pas la réponse]
            
            Ne génère **qu’un seul** exercice.`,
    "3": `Génère un **nouveau problème différent à chaque fois** simple de mathématiques en français pour enfant d'un niveau maximum de CE2, le problème doit contenir **une petite mise en situation réaliste** (avec une phrase ou deux), et se terminer par une question. 
            Retourne uniquement le texte sous ce format EXACT :
            
            Problème : [énoncé du problème]
            Réponse : [réponse numérique]
            GoodResponse : [petite phrase d'encouragement si l'enfant a réussi]
            BadResponse : [petite phrase d'encouragement si l'enfant s'est trompé,ne donne pas la réponse]
            
            Ne génère **qu’un seul** exercice.`,
    "4": ""
}

/**
 * Boite de dialogue utilisé par QT sur l'interface pour intéragir avec l'utilisateur
 * @param gameIndex
 * @param setIsMultipleChoice
 * @param setMultiplesChoices
 * @param setCorrectAnswer
 * @param newProblem
 * @param feedback
 * @returns {Element}
 * @constructor
 */
export default function DialogBox({
                                      gameIndex,
                                      setIsMultipleChoice,
                                      setMultiplesChoices,
                                      setCorrectAnswer,
                                      newProblem,
                                      feedback,
                                      timer,
                                      onTimeout,
                                      gameEnded,
                                      isTimedGame,
                                      score,
                                      nbQuestion

                                  }) {
    const [problem, setProblem] = useState("");
    const [goodResponse, setGoodResponse] = useState("");
    const [badResponse, setBadResponse] = useState("");

    const [tempGoodResponse, setTempGoodResponse] = useState("");
    const [tempBadResponse, setTempBadResponse] = useState("");

    const apiKey = "6xk1gvqX1Vt8nihvZdzcXKkx0T10tcIl";

    const client = new Mistral({apiKey: apiKey});

    const chatHistory = useRef([
        {
            role: "system",
            content: "Tu es un générateur d'exercices pour des enfants de CE2. Ne répète jamais un problème déjà généré."
        }
    ]);

    useEffect(() => {
        generateProblem().then();
    }, [newProblem])

    useEffect(() => {
        if (feedback === "") {
            setGoodResponse(tempGoodResponse);
            setBadResponse(tempBadResponse);
        }
    }, [feedback]);

    useEffect(() => {
        if (timer === 0) {
            onTimeout();
        }
    }, [timer, onTimeout]);

    const generateProblem = async () => {
        setProblem("...")
        if (gameIndex !== "0") {

            chatHistory.current.push({
                role: "user",
                content: isTimedGame ? prompts[Math.floor(Math.random() * 3) + 1] : prompts[gameIndex]
            })

            console.log(Math.floor(Math.random() * 3) + 1)

            const chatResponse = await client.chat.complete({
                model: "mistral-small",
                messages: chatHistory.current,
                temperature: 0.9,
                top_p: 0.95
            })

            const generatedText = chatResponse.choices[0].message.content;

            // Enregistrement de la réponse de Mistral pour qu'il se souvienne de ce qu'il à dit
            chatHistory.current.push({
                role: "assistant",
                content: generatedText
            });

            const lignes = generatedText
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => line.split(':').slice(1).join(':').trim());

            console.log(lignes)

            const [question, answer, goodAnswer, badAnswer] = lignes;


            setProblem(question.trim());
            setCorrectAnswer(answer.trim());

            if (goodResponse === "") {
                setGoodResponse(goodAnswer);
                setBadResponse(badAnswer);
            }

            setTempGoodResponse(goodAnswer);
            setTempBadResponse(badAnswer);
        } else {
            setProblem("Apprends les Maths avec QT !")
        }
    };

    useEffect(() => {
        let textToSpeak = "";

        if (isTimedGame && gameEnded) {
            textToSpeak = `Le jeu est terminé. Tu as eu ${score} bonnes réponses sur ${nbQuestion}. Bravo !`;
        } else if (feedback !== "") {
            textToSpeak = feedback === "TRUE" ? goodResponse : badResponse;
        } else {
            textToSpeak = problem;
        }

        if (textToSpeak) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'fr-FR';
            const voices = speechSynthesis.getVoices();
            const robotVoice = voices.find(voice =>
                    voice.lang === 'fr-FR' && (
                        voice.name.toLowerCase().includes("google") ||
                        voice.name.toLowerCase().includes("hortense") ||
                        voice.name.toLowerCase().includes("amelie") ||
                        voice.name.toLowerCase().includes("thomas") ||
                        voice.name.toLowerCase().includes("auguste")
                    )
            );
            if (robotVoice) {
                utterance.voice = robotVoice;
            }

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }
    }, [problem, goodResponse, badResponse, feedback, isTimedGame, gameEnded, score, nbQuestion]);


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
            width: "50vh",
            height: "20vh",
            fontSize: "clamp(1rem, 1.0vw, 1.5rem)",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            wordWrap: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
            zIndex: "1",
        }}>
            {(isTimedGame && gameEnded) ? `Le jeu est fini, ton score est de : ${score}/${nbQuestion}` : feedback !== "" ? feedback === "TRUE" ? goodResponse : badResponse : problem}
        </div>
    );
}