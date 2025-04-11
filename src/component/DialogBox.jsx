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
            Réponse : [réponse en un seul mot, si la réponse est un chiffre en lettres comme 'quatre' met directement '4']
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

const promptsMultipleChoice = {
    "0": "",
    "1": `Génère une **nouvelle opération de mathématiques différente** à chaque fois pour un élève de CE2. Varie les nombres et les opérateurs (+, -, ×), utilise des nombres inférieurs à 50, pour les multiplications utilise seulement des nombres inférieurs à 10, ne fait pas de division, sans jamais répéter un exercice déjà généré. 
            Retourne uniquement le texte sous ce format EXACT de choix multiple :

            Problème : [énoncé du calcul sous forme "n opération n"]
            Réponse : [réponse numérique correcte]
            Choix : [réponse numérique 1, réponse numérique 2, réponse numérique 3, réponse numérique 4]
            GoodResponse : [petite phrase d'encouragement si l'enfant a réussi]
            BadResponse : [petite phrase d'encouragement si l'enfant s'est trompé, ne donne pas la réponse]
            
            Ne génère **qu’un seul** exercice.`,

    "2": `Génère une **nouvelle question sur la géométrie en français différente à chaque fois** pour enfant d'un niveau maximum de CE2.
            Retourne uniquement le texte sous ce format EXACT de choix multiple :
            
            Problème : [énoncé]
            Réponse : [réponse en un seul mot correcte, si la réponse est un chiffre en lettres comme 'quatre' met directement '4']
            Choix : [réponse en un seul mot 1, réponse en un seul mot 2, réponse en un seul mot 3, réponse en un seul mot 4]
            GoodResponse : [petite phrase d'encouragement si l'enfant a réussi]
            BadResponse : [petite phrase d'encouragement si l'enfant s'est trompé,ne donne pas la réponse]
            
            Ne génère **qu’un seul** exercice.`,
    "3": `Génère un **nouveau problème différent à chaque fois** simple de mathématiques en français pour enfant d'un niveau maximum de CE2, le problème doit contenir **une petite mise en situation réaliste** (avec une phrase ou deux), et se terminer par une question. 
            Retourne uniquement le texte sous ce format EXACT de choix multiple :
            
            Problème : [énoncé du problème]
            Réponse : [réponse numérique correcte]
            Choix : [réponse numérique 1, réponse numérique 2, réponse numérique 3, réponse numérique 4]
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
 * @param timer
 * @param onTimeout
 * @param gameEnded
 * @param isTimedGame
 * @param score
 * @param nbQuestion
 * @param onSpeechFinished
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
                                      nbQuestion,
                                      onSpeechFinished

                                  }) {
    const [problem, setProblem] = useState("");
    const [goodResponse, setGoodResponse] = useState("");
    const [badResponse, setBadResponse] = useState("");

    const [tempGoodResponse, setTempGoodResponse] = useState("");
    const [tempBadResponse, setTempBadResponse] = useState("");

    const [responseRobotFinished, setResponseRobotFinished] = useState(false);

    const apiKey = "6xk1gvqX1Vt8nihvZdzcXKkx0T10tcIl";

    const client = new Mistral({apiKey: apiKey});

    const chatHistory = useRef([
        {
            role: "system",
            content: "Tu es un générateur d'exercices pour des enfants de CE2. Ne répète jamais un problème déjà généré."
        }
    ]);

    useEffect(() => {
        generateProblem(newProblem % 4 === 0).then();
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

    const generateProblem = async (multipleChoice) => {
        setProblem("...")
        if (gameIndex !== "0") {

            const promptsToUse = multipleChoice ? promptsMultipleChoice : prompts;

            chatHistory.current.push({
                role: "user",
                content: isTimedGame ? promptsToUse[Math.floor(Math.random() * 3) + 1] : promptsToUse[gameIndex]
            })

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

            let question, answer, goodAnswer, badAnswer;

            if (multipleChoice) {
                let choices;
                [question, answer, choices, goodAnswer, badAnswer] = lignes;
                choices = choices.split(",");
                setMultiplesChoices(choices);
            } else {
                [question, answer, goodAnswer, badAnswer] = lignes;
            }

            setIsMultipleChoice(multipleChoice)
            setProblem(question.trim());
            setCorrectAnswer(answer.trim());


            setGoodResponse(goodAnswer);
            setBadResponse(badAnswer);


            setTempGoodResponse(goodAnswer);
            setTempBadResponse(badAnswer);
        } else {
            setProblem("Apprends les Maths avec QT !")
        }
    };

    useEffect(() => {
        let textToSpeak;

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

            utterance.onend = () => {
                if (feedback !== "") {
                    setTimeout(() => {
                        setResponseRobotFinished(true);
                        onSpeechFinished()
                    }, 300);
                }
            };

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }
    }, [problem, goodResponse, badResponse, feedback, isTimedGame, gameEnded, score, nbQuestion]);


    return (
        <div style={{ position: "absolute", top: "7vw", left: "14vw" }}>
            <div style={{
                position: "relative",
                background: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                fontFamily: "Arial , sans-serif",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
                padding: "20px 25px",
                borderRadius: "50px",
                width: "25vw",
                heigth: "10vw",
                whiteSpace: "pre-wrap",
                zIndex: 900
            }}>
                <div style={{
                    zIndex:1000
                }}>
                    <p>
                        {(isTimedGame && gameEnded)
                            ? `Le jeu est fini, ton score est de : ${score}/${nbQuestion}`
                            : feedback !== ""
                                ? feedback === "TRUE" ? goodResponse : badResponse
                                : problem}
                    </p>
                </div>
                <div style={{
                    backgroundColor: "white",
                    position: "absolute",
                    left: "15vw",
                    bottom: "-36px",
                    width: "60px",
                    height: "100px",
                    transform: "rotate(-68deg)",
                    zIndex: 1
                }} />
            </div>
        </div>
    );
}