// Script para el juego de verbos irregulares en inglés

// Escucha el evento de carga completa del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Botones para seleccionar el grupo de verbos
    const first50Btn = document.getElementById('first50');
    const last50Btn = document.getElementById('last50');
    const allVerbsBtn = document.getElementById('all');

    // Variables para almacenar los verbos y la selección actual
    let verbs = [];
    let selectedVerbs = [];
    let currentQuestionIndex = 0;

    // Cargar los verbos desde el archivo JSON
    fetch('./resources/verbos.json')
        .then(response => {
            console.log('Intentando cargar el archivo verbos.json...');
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                console.error('No se pudo cargar el archivo verbos.json. Código de respuesta:', response.status);
                throw new Error('No se pudo cargar el archivo verbos.json. Verifica la ruta y el archivo.');
            }
            return response.json();
        })
        .then(data => {
            // Asignar los verbos cargados a la variable verbs
            if (data && data.verbos && Array.isArray(data.verbos)) {
                verbs = data.verbos;
                console.log('Verbos cargados correctamente:', verbs);
                if (verbs.length > 0) {
                    console.log('Cantidad de verbos cargados:', verbs.length);
                    document.getElementById('total-verbs').textContent = `Número total de verbos: ${verbs.length}`;
                }
            } else {
                console.error('Estructura del archivo JSON no es la esperada o está vacía:', JSON.stringify(data, null, 2));
            }
            console.log('Verbos cargados:', verbs);
            if (verbs.length === 0) {
                console.error('No se encontraron verbos en el archivo JSON.');
            }
        })
        .catch(error => {
            // Manejar errores en la carga del archivo JSON
            console.error('Error al cargar los verbos:', error);
        });

    // Asignar eventos de clic a los botones para seleccionar los verbos
    first50Btn.addEventListener('click', () => {
        console.log('Botón "Primeros 50 Verbos" presionado');
        // Iniciar el juego con la primera mitad de los verbos
        const mitad = Math.ceil(verbs.length / 2);
        startGame(verbs.slice(0, mitad));
    });

    last50Btn.addEventListener('click', () => {
        console.log('Botón "Últimos 50 Verbos" presionado');
        // Iniciar el juego con la segunda mitad de los verbos
        const mitad = Math.ceil(verbs.length / 2);
        startGame(verbs.slice(mitad));
    });

    allVerbsBtn.addEventListener('click', () => {
        console.log('Botón "Todos los Verbos" presionado');
        // Iniciar el juego con todos los verbos
        startGame(verbs);
    });

    // Iniciar el juego con los verbos seleccionados
    function startGame(verbsToUse) {
        if (verbsToUse.length === 0) {
            console.error('No hay verbos disponibles para el juego.');
            return;
        }
        selectedVerbs = verbsToUse.sort(() => Math.random() - 0.5).slice(0, 20);
        currentQuestionIndex = 0;
        console.log('Iniciando el juego con los verbos seleccionados:', selectedVerbs);
        // Ocultar las opciones de inicio y mostrar el juego
        document.getElementById('start-options').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        nextQuestion();
    }

    // Mostrar la siguiente pregunta
    function nextQuestion() {
        if (currentQuestionIndex < selectedVerbs.length) {
            const verb = selectedVerbs[currentQuestionIndex];
            console.log('Mostrando el verbo actual:', verb);
            // Verificar si las propiedades del verbo existen
            if (verb && verb['Infinitive'] && verb['Simple Past'] && verb['Past Participle']) {
                console.log(`Mostrando la pregunta ${currentQuestionIndex + 1}`);
                // Mostrar el verbo actual para que el usuario lo conjugue
                document.getElementById('question').textContent = `Conjuga el verbo: ${verb['Infinitive']}`;
                document.getElementById('question-counter').textContent = `Pregunta ${currentQuestionIndex + 1}/20`;
                // Limpiar los campos de respuesta
                document.getElementById('infinitive').value = '';
                document.getElementById('past').value = '';
                document.getElementById('participle').value = '';
                document.getElementById('feedback').textContent = '';
            } else {
                console.error('El verbo actual no tiene las propiedades necesarias:', verb);
            }
        } else {
            console.log('No hay más preguntas, terminando el juego.');
            // Si no hay más preguntas, terminar el juego
            endGame();
        }
    }

    // Procesar la respuesta del usuario
    document.getElementById('submit-answer').addEventListener('click', () => {
        // Obtener los valores ingresados por el usuario
        const infinitive = document.getElementById('infinitive').value.trim().toLowerCase();
        const past = document.getElementById('past').value.trim().toLowerCase();
        const participle = document.getElementById('participle').value.trim().toLowerCase();

        const verb = selectedVerbs[currentQuestionIndex];

        // Verificar la respuesta del usuario
        if (infinitive === verb['Infinitive'].toLowerCase() && past === verb['Simple Past'].toLowerCase() && participle === verb['Past Participle'].toLowerCase()) {
            document.getElementById('feedback').textContent = '¡Correcto!';
            document.getElementById('feedback').classList.remove('incorrect');
            document.getElementById('feedback').classList.add('correct');
        } else {
            document.getElementById('feedback').textContent = `Incorrecto. La respuesta correcta es: ${verb['Infinitive']}, ${verb['Simple Past']}, ${verb['Past Participle']}`;
            document.getElementById('feedback').classList.remove('correct');
            document.getElementById('feedback').classList.add('incorrect');
        }

        currentQuestionIndex++;
        // Mostrar la siguiente pregunta después de 1.5 segundos
        setTimeout(nextQuestion, 1500);
    });

    // Terminar el juego y mostrar los resultados
    function endGame() {
        // Ocultar el juego y mostrar los resultados
        document.getElementById('game').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('final-score').textContent = `¡Juego completado! Respondiste 20 preguntas.`;
    }

    // Reiniciar el juego
    window.restartGame = function() {
        // Reiniciar el índice de preguntas y mostrar las opciones de inicio
        currentQuestionIndex = 0;
        document.getElementById('results').classList.add('hidden');
        document.getElementById('start-options').classList.remove('hidden');
    }
});

// Estilos adicionales para centrar el contenido y mejorar el diseño
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column';
        mainContainer.style.alignItems = 'center';
        mainContainer.style.justifyContent = 'flex-start';
        mainContainer.style.paddingTop = '10vh';
        mainContainer.style.minHeight = '100vh';
    }

    const gameContainer = document.getElementById('game');
    if (gameContainer) {
        gameContainer.style.textAlign = 'center';
    }

    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        resultsContainer.style.textAlign = 'center';
    }
});
