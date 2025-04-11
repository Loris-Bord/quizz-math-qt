# Documentation

# Partie Utilisateur

## Comment accéder à l'application ?

Pas besoin d'installation ou de téléchargement !

Il suffit de cliquer sur ce lien pour accéder directement au site :

→ https://loris-bord.github.io/quizz-math-qt/

---

## Qu’est-ce qu’on y trouve ?

Ce site propose plein d'activités autour des maths, pour apprendre en s'amusant !

Voici ce que vous pouvez y faire :

- Calcul mental : pour s'entraîner à aller vite.
- Géométrie : des exercices pour tester sa connaissance des formes géométriques.
- Problèmes : des petits problèmes simples pour familiariser les enfants avec des énoncés mathématiques.
- Jeux chronomètres : parfaits pour tester ses connaissances en un temps limité !

---

## Comment ça marche ?

Sur la page d'accueil, vous trouverez des boutons en bas pour commencer.

Sur les autres pages, la navigation se fait grace au menu en haut de l'ecran.

Les exercices sont proposés sous deux formes :

- Reponse libre : on ecrit directement la reponse.
- Choix multiples : on selectionne la bonne option parmi plusieurs.



# Partie Technique

Un site web interactif pour aider les jeunes enfants à apprendre les mathématiques, avec le robot QT comme mascotte.

---

##  Objectif

Ce projet vise à rendre l’apprentissage des mathématiques plus ludique et accessible pour les enfants en bas âge. À travers des quiz animés et la lecture vocale des questions, l’enfant est guidé par le robot QT dans son parcours d’apprentissage.

---

##  Installation et Configuration

Suivez les étapes ci-dessous pour exécuter le projet en local :

1. **Cloner le dépôt :**

    git clone https://github.com/Loris-Bord/quizz-math-qt.git

    Se déplacer dans le dossier du projet :

    cd quizz-math-qt

Installer les dépendances :

    npm install

    Assurez-vous que Node.js et npm sont installés sur votre machine.

Lancer le serveur de développement :

    npm run dev

    L'application sera accessible généralement à l'adresse : http://localhost:5173 (sinon la bonne adresse sera dans le terminal ou vous avez éxécute la commande)

---

## Structure du projet

    src/ : Contient tout le code source de l’application

        Composants React (.jsx)

        Feuilles de style

        Assets (images, sons, etc.)

    public/ : Fichiers statiques

    vite.config.js : Configuration de Vite

    package.json : Dépendances du projet

    index.html : Point d’entrée HTML

---

## Technologies utilisées

    - React : Pour construire l’interface utilisateur.

    - Vite : Pour un démarrage rapide et un développement fluide.

    - Mistral (LLM) : Génère dynamiquement des questions mathématiques adaptées.

    -API Web Speech (SpeechSynthesis) : Pour vocaliser les questions.
