let selectedVerbs = [];
let currentVerb = {};
let score = 0;
let questionCount = 0;
const totalQuestions = 20;  // Cambiamos a 20 preguntas
let incorrectVerbs = [];
let verbs = [];

// Cargar los verbos desde el archivo JSON
fetch('./resources/verbos.json')
    .then(response => response.json())
    .then(data => {
        verbs = data.verbos.map(verb => ({
            infinitivo: verb.Infinitive.toLowerCase(),
            pasadoSimple: verb['Simple Past'].toLowerCase(),
            participioPasado: verb['Past  Participle'].toLowerCase(),
            español: verb.Castellano.toLowerCase()
        }));
        console.log('Verbos cargados:', verbs);
    })
    .catch(error => console.error('Error cargando los verbos:', error));

document.getElementById('first50').addEventListener('click', () => setVerbList('first50'));
document.getElementById('last50').addEventListener('click', () => setVerbList('last50'));
document.getElementById('all').addEventListener('click', () => setVerbList('all'));

function setVerbList(option) {
    if (option === 'first50') {
        selectedVerbs = verbs.slice(0, 52);
    } else if (option === 'last50') {
        selectedVerbs = verbs.slice(-52);
    } else {
        selectedVerbs = verbs;
    }

    // Verificar si hay suficientes verbos antes de iniciar
    if (selectedVerbs.length < totalQuestions) {
        alert('No hay suficientes verbos para realizar el juego. Añade más verbos.');
        return;
    }

    shuffleArray(selectedVerbs);
    selectedVerbs = selectedVerbs.slice(0, totalQuestions);  // Limitar a 20 preguntas
    document.getElementById('start-options').classList.add('hidden');
    startGame();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    document.getElementById('game').classList.remove('hidden');
    score = 0;
    questionCount = 0;
    incorrectVerbs = [];
    showNewQuestion();
}

function showNewQuestion() {
    if (questionCount >= totalQuestions) {
        endGame();
        return;
    }

    currentVerb = selectedVerbs[questionCount];
    document.getElementById('question-counter').textContent = `Pregunta ${questionCount + 1}/20`;
    document.getElementById('question').textContent = `¿Cuáles son las tres formas del verbo '${currentVerb.español}'?`;
    document.getElementById('feedback').innerHTML = '';  // Limpiar feedback anterior
    clearInputs();  // Limpiar los campos de entrada
}

function submitAnswer() {
    const userInfinitive = document.getElementById('infinitive').value.trim().toLowerCase();
    const userPast = document.getElementById('past').value.trim().toLowerCase();
    const userParticiple = document.getElementById('participle').value.trim().toLowerCase();

    const correctInfinitive = currentVerb.infinitivo;
    const correctPast = currentVerb.pasadoSimple;
    const correctParticiple = currentVerb.participioPasado;

    let feedback = '';

    if (userInfinitive === correctInfinitive && userPast === correctPast && userParticiple === correctParticiple) {
        feedback = `<p style="color:green; font-weight: bold;">Bien hecho</p>`;
    } else {
        feedback += '<div style="display: flex; justify-content: space-between; width: 100%;">';

        if (userInfinitive !== correctInfinitive) {
            feedback += `<div><span style="color:black;">Infinitivo: </span><span style="color:red; font-weight:bold;">${correctInfinitive.toUpperCase()}</span></div>`;
        }

        if (userPast !== correctPast) {
            feedback += `<div><span style="color:black;">Pasado simple: </span><span style="color:red; font-weight:bold;">${correctPast.toUpperCase()}</span></div>`;
        }

        if (userParticiple !== correctParticiple) {
            feedback += `<div><span style="color:black;">Participio pasado: </span><span style="color:red; font-weight:bold;">${correctParticiple.toUpperCase()}</span></div>`;
        }

        feedback += '</div>';
    }

    document.getElementById('feedback').innerHTML = feedback;

    if (feedback.includes("Bien hecho")) {
        score++;
    }

    questionCount++;

    if (questionCount < totalQuestions) {
        setTimeout(showNewQuestion, 2500);  // Espera 2.5 segundos antes de mostrar la siguiente pregunta
    } else {
        setTimeout(endGame, 2500);  // Espera 2.5 segundos antes de terminar el juego
    }
}

document.getElementById('submit-answer').addEventListener('click', submitAnswer);

function clearInputs() {
    document.getElementById('infinitive').value = '';
    document.getElementById('past').value = '';
    document.getElementById('participle').value = '';
}

function endGame() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    // Nueva escala de puntuación para 20 preguntas
    let finalScore;
    switch (score) {
        case 20:
            finalScore = '10';
            break;
        case 19:
            finalScore = '9';
            break;
        case 18:
            finalScore = '8';
            break;
        case 17:
            finalScore = '7';
            break;
        case 16:
            finalScore = '6';
            break;
        case 15:
            finalScore = '5';
            break;
        default:
            finalScore = 'Tienes que seguir estudiando';
    }

    document.getElementById('final-score').textContent = `Puntuación final: ${finalScore}`;

    // Mostrar botón de "Volver a la página de inicio"
    const backButton = document.createElement('button');
    backButton.textContent = "Volver a la página de inicio";
    backButton.style = "margin-top: 20px; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;";
    backButton.onclick = () => {
        window.location.href = 'index.html';
    };
    document.getElementById('results').appendChild(backButton);
}

function restartGame() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('start-options').classList.remove('hidden');
}