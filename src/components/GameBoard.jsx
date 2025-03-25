import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlayerStatus from "./PlayerStatus";
import Popup from "./Popup";

const GameBoard = ({ loggedInUser, aiUser, difficulty }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [scores, setScores] = useState({ User: 0, AI: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const winner = calculateWinner(board);

  const checkGameResult = (newBoard) => {
    const currentWinner = calculateWinner(newBoard);
    if (currentWinner) {
      setScores((prevScores) => ({
        ...prevScores,
        [currentWinner === "X" ? "User" : "AI"]: prevScores[currentWinner === "X" ? "User" : "AI"] + 1,
      }));
      setShowPopup(true);
    } else if (newBoard.every((square) => square)) {
      setShowPopup(true);
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner || !isUserTurn) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsUserTurn(false);
    checkGameResult(newBoard);
  };

  const makeAIMove = () => {
    // First check if AI can win immediately (always do this)
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "O";
        if (calculateWinner(newBoard)) {
          setBoard(newBoard);
          setIsUserTurn(true);
          checkGameResult(newBoard);
          return;
        }
      }
    }

    // Determine if AI should play optimally based on difficulty
    let shouldPlayOptimally;
    switch(difficulty) {
      case "easy":
        shouldPlayOptimally = Math.random() < 0.05; // 5% optimal play
        break;
      case "medium":
        shouldPlayOptimally = Math.random() < 0.85; // 85% optimal play
        break;
      case "hard":
        shouldPlayOptimally = true; // 100% optimal play
        break;
      default:
        shouldPlayOptimally = true;
    }

    if (shouldPlayOptimally) {
      // Block player if they can win next move
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const newBoard = [...board];
          newBoard[i] = "X";
          if (calculateWinner(newBoard)) {
            newBoard[i] = "O";
            setBoard(newBoard);
            setIsUserTurn(true);
            checkGameResult(newBoard);
            return;
          }
        }
      }

      // Take center if available
      if (board[4] === null) {
        const newBoard = [...board];
        newBoard[4] = "O";
        setBoard(newBoard);
        setIsUserTurn(true);
        checkGameResult(newBoard);
        return;
      }

      // Take opposite corner if player is in corner
      const oppositeCorners = {0:8, 2:6, 6:2, 8:0};
      for (const [playerCorner, aiCorner] of Object.entries(oppositeCorners)) {
        if (board[playerCorner] === "X" && board[aiCorner] === null) {
          const newBoard = [...board];
          newBoard[aiCorner] = "O";
          setBoard(newBoard);
          setIsUserTurn(true);
          checkGameResult(newBoard);
          return;
        }
      }

      // Take any empty corner
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(i => board[i] === null);
      if (availableCorners.length > 0) {
        const newBoard = [...board];
        newBoard[availableCorners[0]] = "O";
        setBoard(newBoard);
        setIsUserTurn(true);
        checkGameResult(newBoard);
        return;
      }
    }

    // Otherwise make a random move
    const emptySquares = board.map((square, index) => 
      square === null ? index : null
    ).filter(val => val !== null);
    
    if (emptySquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      const bestMove = emptySquares[randomIndex];
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      setIsUserTurn(true);
      checkGameResult(newBoard);
    }
  };

  useEffect(() => {
    if (!isUserTurn && !winner && loggedInUser) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, board, winner, loggedInUser]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setShowPopup(false);
  };

  const renderSquare = (index) => {
    const value = board[index];
    const textColor = value === "X" ? "text-red-500" : "text-blue-500";

    return (
      <motion.button
        key={index}
        className={`w-24 h-24 border-2 border-white text-4xl font-bold flex items-center justify-center hover:bg-[rgba(88,88,88,0.76)] transition-colors ${textColor}`}
        onClick={() => handleClick(index)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        {value}
      </motion.button>
    );
  };

  const status = winner
    ? `Winner: ${winner === "X" ? loggedInUser : aiUser}`
    : board.every((square) => square)
    ? "It's a Draw!"
    : `Next Player: ${isUserTurn ? loggedInUser : aiUser}`;

  return (
    <>
      <h1 className="text-5xl font-bold mb-8 text-white drop-shadow-lg">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2 bg-[rgba(0,0,0,0.1)] backdrop-blur-md p-6 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div key={index}>{renderSquare(index)}</div>
          ))}
      </div>

      <PlayerStatus status={status} loggedInUser={loggedInUser} aiUser={aiUser} scores={scores} />

      {showPopup && (
        <Popup winner={winner} loggedInUser={loggedInUser} aiUser={aiUser} resetGame={resetGame} />
      )}
    </>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default GameBoard;