const question = document.getElementById("questions");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("questions.json")
  .then((response) => {
    return response.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUSETIONS = 0;

//Start the Quiz
startGame = () => {
  MAX_QUSETIONS = questions.length;
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

//Gets the question for the quiz
getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUSETIONS) {
    //save the player score
    localStorage.setItem("mostRecentScore", score);
    //Go to the end page
    return window.location.assign("/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUSETIONS}`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  //
  choices.forEach((choice) => {
    //  const number = choice.dataset['number']
    //  choice.innerText = currentQuestion[`choice${number}`];
    choice.innerText = currentQuestion[`choice${choice.dataset["number"]}`];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswer = true;

  choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      if (!acceptingAnswer) return;

      acceptingAnswer = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

      selectedChoice.parentElement.classList.add(classToApply);

      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);

      //UPDATE THE PROGRESS BAR
      progressBarFull.style.width = `${
        (questionCounter / MAX_QUSETIONS) * 100
      }%`;
    });
  });
};

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
