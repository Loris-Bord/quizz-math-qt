import React from 'react';

export default function DialogBubble({content = "Apprends les maths avec QT"}) {

    return (
        <div
            style={
                {
                    position: "absolute",
                    top:
                        "30%",
                    left:
                        "25%",
                    transform:
                        "translate(-50%, -50%)",
                    backgroundColor:
                        "white",
                    padding:
                        "5rem 2rem",
                    borderRadius:
                        "15px",
                    boxShadow:
                        "2px 2px 10px rgba(0,0,0,0.3)",
                    fontSize:
                        "2rem",
                    fontWeight:
                        "bold",
                    textAlign:
                        "center",
                    zIndex:
                        "1",
                }
            }>
            {content}
        < /div>
    );
}

/*
    return (<div style={{position: "relative"}}><div style={{position: "relative",
        background: "white",
        color: "black",
        fontFamily: "Arial "sans-serif",
        fontSize:" 22px",
        fontWeight: "bold",
        textAlign: "center",
        padding:" 20px 25px",
        borderRadius: "50px",
        width: "350px",
        transform: "rotate(-3deg)"}}></div></div>)
}


*/

/*


.speech-container {
            position: relative;
        }

        .speech-bubble {
            position: relative;
            background: white;
            color: black;
            font-family: Arial, sans-serif;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            padding: 20px 25px;
            border-radius: 50px;
            width: 350px;
            transform: rotate(-3deg);

box-shadow: 6px 6px 0px #888;
}

.speech-bubble::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 60px;
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 10px solid transparent;
    border-top: 30px solid white;

    filter: drop-shadow(6px 6px 0px #888);
}

 */