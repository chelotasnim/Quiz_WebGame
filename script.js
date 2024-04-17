const menu = document.getElementById('menu');

function start() {
    fetch('data/data.json').then(response => response.json()).then(data => {
        const wrong_bar = document.getElementById('wrong');
        const correct_bar = document.getElementById('correct');
        const poin = document.getElementById('poin');

        const me = document.getElementById('m');
        const se = document.getElementById('s');
        const mse = document.getElementById('ms');

        let m = 0;
        let s = 0;
        let ms = 0;
        let timer = null;

        const quiz_container = document.getElementById('quiz-container');
        const num = document.getElementById('num');
        const template = document.getElementById('template');
        const wording = ['A', 'B', 'C', 'D', 'E', 'F'];

        const result = document.getElementById('result');
        const result_score = document.querySelector('#main-score span');
        const result_correct = document.querySelector('#correct-q label');
        const result_wrong = document.querySelector('#wrong-q label');
        const minute = document.querySelector('#minute label');
        const second = document.querySelector('#second label');

        let q_number = 1;
        let quiz = data;

        let score = 0;
        let wrong = 0;
        let score_per_question = 100 / quiz.length;

        menu.style.display = 'none';
        quiz_container.style.display = 'flex';

        function setQuiz(index) {
            if (index === quiz.length) {
                clearInterval(timer);
                quiz_container.style.display = 'none';

                result.style.display = 'grid';
                result_score.textContent = score;
                result_correct.textContent = (score / score_per_question).toFixed(0);
                result_wrong.textContent = (wrong / score_per_question).toFixed(0);
                minute.textContent = m;
                second.textContent = s;
                return;
            };

            const current = quiz[index];

            timer = setInterval(() => {
                ms++;

                if (ms === 60) {
                    ms = 0;
                    s++;
                };

                if (s === 60) {
                    s = 0;
                    m++;
                };

                me.textContent = String(m).padStart(2, '0');
                se.textContent = String(s).padStart(2, '0');
                mse.textContent = String(ms).padStart(2, '0');
            }, 18);

            let options = '';
            let options_index = 0;
            current.options.forEach(opt => {
                options += `
                <div class="option" onclick="answer(${current.id}, ${options_index})">
                    <label>${wording[options_index]}</label>
                    <p>${opt}</p>
                </div>`;
                options_index++;
            });

            num.textContent = q_number;
            template.innerHTML = `
                    <div class="question">
                        <p>${current.question}</p>
                    </div>
                    <div class="options">
                        ${options}
                    </div>
            `;

            q_number++;
        };
        setQuiz(q_number - 1);

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState == 'hidden') {
                wrong += score_per_question;
                wrong_bar.style.width = `${wrong}%`;

                setQuiz(q_number);
            };
        });

        window.answer = function (id, answer) {
            const current = quiz.find(function (data) { return data.id === id });
            const allOptions = document.querySelectorAll('.option');
            allOptions.forEach(opt => {
                opt.classList.add('answered');
            });

            clearInterval(timer);

            if (answer === current.answer) {
                allOptions[answer].classList.add('correct');

                score += score_per_question;
                poin.textContent = score.toFixed(1);

                correct_bar.style.width = `${score}%`;

            } else {
                allOptions[current.answer].classList.add('correct');
                allOptions[answer].classList.add('wrong');

                wrong += score_per_question;
                wrong_bar.style.width = `${wrong}%`;
            };

            setTimeout(() => {
                setQuiz(q_number - 1);
            }, 5000);
        };
    });
};

function ready(e) {
    let count = 5;
    e.textContent = count--;
    setInterval(() => {
        if (count === 0) {
            e.textContent = 'GO!';
        } else {
            e.textContent = count--;
        };
    }, 1000);

    setTimeout(() => {
        start();
    }, 5800);
};