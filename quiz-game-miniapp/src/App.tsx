import { useState, useEffect } from "react";
import "./App.css";
import './QuizApp.css';

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: "What is Celo?",
    options: ["A smartphone", "A blockchain", "A web browser", "A game"],
    answer: "A blockchain",
    explanation: "Celo is a carbon-negative blockchain platform focused on making financial tools accessible to anyone with a mobile phone."
  },
  {
    id: 2,
    question: "What language is primarily used to write smart contracts?",
    options: ["Solidity", "Python", "Java", "Rust"],
    answer: "Solidity",
    explanation: "Solidity is the most widely used programming language for Ethereum-compatible blockchains."
  },
  {
    id: 3,
    question: "What is Farcaster?",
    options: ["A social protocol", "A messaging app", "A video editor", "A search engine"],
    answer: "A social protocol",
    explanation: "Farcaster is a decentralized social protocol that enables developers to build social apps like frames."
  },
  {
    id: 4,
    question: "What powers Farcaster Frames?",
    options: ["JavaScript", "Solidity", "Python", "WebAssembly"],
    answer: "JavaScript",
    explanation: "Frames are interactive elements built with JavaScript that can be embedded within Farcaster."
  },
  {
    id: 5,
    question: "What is a Web3 wallet used for?",
    options: ["Storing cryptocurrencies", "Browsing the internet", "Editing documents", "Playing games"],
    answer: "Storing cryptocurrencies",
    explanation: "Web3 wallets store your crypto assets and allow you to interact with decentralized applications."
  }
];

// Main Quiz Component
export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [animation, setAnimation] = useState("");
  
  // Initialize timer when question changes
  useEffect(() => {
let timerInterval: NodeJS.Timeout | null = null;
    
    if (!showResult && !answered) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
if (timerInterval) clearInterval(timerInterval);
            handleTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      // Clean up interval on unmount or when dependencies change
      return () => {
        if (timerInterval) clearInterval(timerInterval);
      };
    }
  }, [currentQuestion, answered, showResult]);

  // Handle timeout when timer reaches zero
  const handleTimeout = () => {
    setAnswered(true);
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  // Handle option selection
const handleOptionClick = (option: string) => {
    if (answered) return;
    
    setAnswered(true); // This will stop the timer via the useEffect dependency
    setSelectedOption(option);
    
    const correct = option === quizQuestions[currentQuestion].answer;
    if (correct) {
      setScore((prev) => prev + 1);
      setAnimation("correct-answer");
    } else {
      setAnimation("wrong-answer");
    }
    
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  // Move to next question or show results
  const moveToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption("");
      setAnswered(false);
      setTimeLeft(15);
      setAnimation("");
    } else {
      setShowResult(true);
    }
  };

  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setTimeLeft(15);
    setAnimation("");
  };

  // Calculate reward based on score (placeholder for blockchain integration)
  const calculateReward = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "0.01 ETH";
    if (percentage >= 60) return "0.005 ETH";
    return "Participation Badge NFT";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {!showResult ? (
        <div className={`w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden ${animation}`}>
          {/* Progress bar */}
          <div className="w-full bg-gray-700 h-2">
            <div 
              className="bg-blue-500 h-2 transition-all duration-300" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Quiz header */}
          <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-blue-400">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </span>
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${timeLeft <= 5 ? 'bg-red-600' : 'bg-blue-600'}`}>
                {timeLeft}s
              </div>
            </div>
            <h2 className="text-xl font-bold mb-6">{quizQuestions[currentQuestion].question}</h2>
          </div>
          
          {/* Options */}
          <div className="p-6 pt-0">
            <ul className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => {
                let optionClass = "bg-gray-700 hover:bg-gray-600 transition-colors duration-200";
                
                if (answered) {
                  if (option === quizQuestions[currentQuestion].answer) {
                    optionClass = "bg-green-600";
                  } else if (option === selectedOption && option !== quizQuestions[currentQuestion].answer) {
                    optionClass = "bg-red-600";
                  } else {
                    optionClass = "bg-gray-700 opacity-50";
                  }
                }
                
                return (
                  <li
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer ${optionClass}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 mr-3">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            
            {/* Explanation shown after answering */}
            {answered && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <p className="text-sm">{quizQuestions[currentQuestion].explanation}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">{score}/{quizQuestions.length}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Completed 🎉</h2>
            <p className="mb-4 text-gray-300">You scored {score} out of {quizQuestions.length} questions</p>
            
            {/* Rewards section */}
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Reward</h3>
              <p className="text-blue-400 text-lg font-bold mb-1">{calculateReward()}</p>
              <p className="text-sm text-gray-300">Rewards will be processed to your wallet shortly</p>
            </div>
            
            {/* Performance feedback */}
            <div className="mb-6">
              {score === quizQuestions.length && (
                <p className="text-green-400">Perfect score! You're a Web3 expert!</p>
              )}
              {score >= quizQuestions.length * 0.7 && score < quizQuestions.length && (
                <p className="text-green-400">Great job! You know your Web3 concepts well!</p>
              )}
              {score >= quizQuestions.length * 0.4 && score < quizQuestions.length * 0.7 && (
                <p className="text-yellow-400">Good effort! Keep learning about Web3.</p>
              )}
              {score < quizQuestions.length * 0.4 && (
                <p className="text-red-400">Keep studying! Web3 takes time to master.</p>
              )}
            </div>
            
            {/* Action buttons */}
            <button 
              onClick={restartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full mb-3 transition-colors duration-200"
            >
              Try Again
            </button>
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg w-full transition-colors duration-200"
            >
              Share Results
            </button>
          </div>
        </div>
      )}

      {/* Footer with social sharing */}
      <div className="mt-6 text-sm text-gray-400">
        Built on Farcaster • Share your results
      </div>
    </div>
  );
}