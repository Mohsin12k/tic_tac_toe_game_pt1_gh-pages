import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import StartGameBtn from "./components/StartGameBtn";
import { useState, useEffect, useRef } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('❌');
  const [countDown, setCountDown] = useState(10);
  const [gameBoard, setGameBoard] = useState(Array(9).fill(''));
  const [winnerPad, setWinnerPad] = useState([]);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [result, setResult] = useState('');
  const [finalWinner, setFinalWinner] = useState(false);
  const [resultWinner, setResultWinner] = useState(false);
  const [showFinalWinner, setShowFinalWinner] = useState('');
  const speed1 = 1000;
  const speed2 = 2000;
  const speed3 = 4000;
  const speed4 = 50;
  const winnerCoditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],  
  ];
  const navigate = useNavigate();
  const startBtnIntervalRf = useRef(null);
  const endValue = 100;
  const countDownIntervalRf = useRef(0);
  const [startBtn, setStartBtn] = useState(false);
  const bgRf = useRef(null);
  const countUpBtnRf = useRef(null);
  let intervalRf = useRef(null);

  // Start Button Game and clear interval

  useEffect(() => {

    resetGame();

}, []);

  useEffect(() => {
  return () => {
    clearInterval(intervalRf.current);
    clearInterval(startBtnIntervalRf.current);
  };
}, []);

  useEffect(() => {
    navigate('/startBtn');
  },[]);

  // start button
  
  const startGame = () => {
    if(startBtn) return;
    setStartBtn(true);
    startBtnIntervalRf.current = setInterval(() => {
      countDownIntervalRf.current += 1;
      let newValue = countDownIntervalRf.current;
      let degree = newValue * 3.6;
      bgRf.current.style.background = 
      `conic-gradient(#4ade80 ${degree}deg,white ${degree}deg)`;
      countUpBtnRf.current.textContent = newValue;

      if(newValue === 10){
        countUpBtnRf.current.classList.add('text-white','text-2xl');
        bgRf.current.classList.add('shadow-[0_0_20px_5px_white]'); 
      }
      if(newValue === 30){
        countUpBtnRf.current.classList.remove('text-white','text-2xl');
        bgRf.current.classList.remove('shadow-[0_0_20px_5px_white]'); 

        countUpBtnRf.current.classList.add('text-green-500','text-3xl');
        bgRf.current.classList.add('shadow-[0_0_20px_5px_green]'); 
      } 
      if(newValue === 80){
        countUpBtnRf.current.classList.remove('text-white','text-2xl');
        bgRf.current.classList.remove('shadow-[0_0_20px_5px_white]'); 
        countUpBtnRf.current.classList.remove('text-green-500','text-3xl');
        bgRf.current.classList.remove('shadow-[0_0_20px_5px_green]');

        countUpBtnRf.current.classList.add('text-red-500','text-4xl');
        bgRf.current.classList.add('shadow-[0_0_20px_5px_red]'); 
      }
      if(newValue === endValue){
        clearInterval(startBtnIntervalRf.current);
        setStartBtn(false);
        countDownIntervalRf.current = 0;
        resetGame();
        tryAgain();
        navigate('/playGame');    
      }
    }, speed4);
  }

  const endGame = () => {
    navigate('/startBtn');
    resetGame();
  }

// header code timer

const startsCountDown = () => {
  clearInterval(intervalRf.current);
  setCountDown(10);
  intervalRf.current = setInterval(() => {
    setCountDown((prev) => prev - 1);
  }, speed1);
}

useEffect(() => {
  if(countDown === 0){
    setCurrentPlayer(currentPlayer => currentPlayer === '❌' ? '🎃' : '❌');
    setCountDown(10);
    clearInterval(intervalRf.current);
    startsCountDown();
  };
}, [countDown])

// main code
  const handleClick = (index) => {

    if(gameBoard[index] || result){
      setResult("Invalid 😔");
      setTimeout(() => {
        setResult('');
        return;
      }, speed2);
    };

    const newGameBoard = [...gameBoard];
    newGameBoard[index] = currentPlayer;
    setGameBoard(newGameBoard);

    checkWinner(newGameBoard);
    setCurrentPlayer(currentPlayer => currentPlayer === '❌' ? '🎃' : '❌');
    startsCountDown();
  }

  const checkWinner = (board) => {
    for(let condition of winnerCoditions){
      const [a, b, c] = condition;
      if(board[a] === board[b] && board[a] === board[c] && board[a]){
        setResult(`Winner is ${board[a]} 🎉`);
        setWinnerPad(condition);
        setTimeout(() => {
          tryAgain();
        }, speed3);

        if(gameBoard[a] === '❌') {
          const newScoreX = scoreX + 1;
          setScoreX(newScoreX);
          setResultWinner(true);
          if(newScoreX === 4) {
            setResult(`Last Round ${board[a]} 😉`);
            return;
          }
          if(newScoreX === 5) {
                setFinalWinner(true);
                setShowFinalWinner(`Final winner is ${board[a]} ✌🎉`);
                setTimeout(() => {
                  resetGame();
                }, speed3);
                return;
          }
        } else {
          const newScoreO = scoreO + 1;
          setScoreO(newScoreO);
          setResultWinner(true);
          if(newScoreO === 4) {
            setResult(`Last Round ${board[a]} 😉`);
            return;
          }
          if(newScoreO === 5) {
              setFinalWinner(true);
              setShowFinalWinner(`Final winner is ${board[a]} ✌🎉`);
              setTimeout(() => {
                  resetGame();
                }, speed3);
                return;
          }
        } 
        return;
      }
    }

    if(!board.includes('')) {
      setResult("It's Draw 😮");
      setResultWinner(true);
      setTimeout(() => {
        tryAgain();
      }, speed2);
      return;
  } 
  }

  // Reset code

  const resetGame = () => {
    clearInterval(intervalRf.current);
    setCountDown(10);
    setScoreO(0);
    setScoreX(0);
    setResult('');
    setCurrentPlayer('❌');
    setGameBoard(Array(9).fill(''));
    setWinnerPad([]);
    setFinalWinner(false);
    setShowFinalWinner('');
    setStartBtn(false);
    countDownIntervalRf.current = 0;
    clearInterval(startBtnIntervalRf.current);
  };

  // tryAgain

  const tryAgain = () => {
    clearInterval(intervalRf.current);
    setCountDown(10);
    setResult('');
    setCurrentPlayer('❌');
    setGameBoard(Array(9).fill(''));
    setWinnerPad([]);
    setResultWinner(false);
  }
  return (
    <>
    <Routes>
      < Route path="/playGame" element={
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      
        <main className='text-white w-[40%] h-[70%] bg-blue-300
        flex flex-col items-center justify-center p-3 rounded-xl max-[1000px]:w-full
        max-[1000px]:h-full
        '
        >
          <Header 
          currentPlayer={currentPlayer} 
          countDown={countDown} 
          endGame={endGame}
          />

            <Main 
            gameBoard={gameBoard} 
            handleClick={handleClick} 
            winnerPad={winnerPad} 
            finalWinner={finalWinner}
            showFinalWinner={showFinalWinner}
            />

           <Footer
              scoreX={scoreX}
              scoreO={scoreO}
              result={result}
              resetGame={resetGame}
              resultWinner={resultWinner}
            />
        </main>
      </div>
      }/>
      <Route path="/startBtn" element={<StartGameBtn 
      startGame={startGame} 
      bgRf={bgRf}
      countUpBtnRf={countUpBtnRf}
      />}/>
      </Routes>
    </>
  )
}

export default App
