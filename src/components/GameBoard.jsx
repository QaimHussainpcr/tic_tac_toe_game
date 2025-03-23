import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlayerStatus from "./PlayerStatus";
import Popup from "./Popup";

const GameBoard = ({ loggedInUser, aiUser }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true); // True for user, false for AI
  const [scores, setScores] = useState({ User: 0, AI: 0 });
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const winner = calculateWinner(board);

  // Handle user click
  const handleClick = (index) => {
    if (board[index] || winner || !isUserTurn) return; // Prevent clicks during AI's turn
    const newBoard = [...board];
    newBoard[index] = "X"; // User is always "X"
    setBoard(newBoard);
    setIsUserTurn(false); // Switch to AI's turn

    // Check for a winner after updating the board
    const currentWinner = calculateWinner(newBoard);
    if (currentWinner) {
      setScores((prevScores) => ({
        ...prevScores,
        User: prevScores.User + 1,
      }));
      setShowPopup(true); // Show popup when there's a winner
    } else if (newBoard.every((square) => square)) {
      setShowPopup(true); // Show popup when the game is tied
    }
  };

  // Minimax algorithm for AI
  const minimax = (board, depth, isMaximizing) => {
    const winner = calculateWinner(board);
    if (winner === "O") return 10 - depth; // AI wins
    if (winner === "X") return depth - 10; // User wins
    if (board.every((square) => square)) return 0; // Draw

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // AI makes a move using Minimax
  const makeAIMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== null) {
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      setIsUserTurn(true); // Switch back to user's turn

      // Check for a winner after AI's move
      const currentWinner = calculateWinner(newBoard);
      if (currentWinner) {
        setScores((prevScores) => ({
          ...prevScores,
          AI: prevScores.AI + 1,
        }));
        setShowPopup(true); // Show popup when there's a winner
      } else if (newBoard.every((square) => square)) {
        setShowPopup(true); // Show popup when the game is tied
      }
    }
  };

  // AI makes a move
  useEffect(() => {
    if (!isUserTurn && !winner && loggedInUser) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000); // Simulate AI thinking with a 1-second delay

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isUserTurn, board, winner, loggedInUser]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true); // User starts first
    setShowPopup(false); // Hide popup after resetting the game
  };

  const renderSquare = (index) => {
    const value = board[index];
    const textColor = value === "X" ? "text-red-500" : "text-blue-500"; // Red for X, Blue for O

    return (
      <motion.button
        key={index}
        className={`w-24 h-24 border-2 border-white text-4xl font-bold flex items-center justify-center hover:bg-[rgba(88,88,88,0.76)] transition-colors ${textColor}`} // 10% black background on hover
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
      <div className="grid grid-cols-3 gap-2 bg-[rgba(0,0,0,0.1)] backdrop-blur-md p-6 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]"> {/* White shadow with 30% opacity */}
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div key={index}>{renderSquare(index)}</div>
          ))}
      </div>

      {/* Player Status */}
      <PlayerStatus status={status} loggedInUser={loggedInUser} aiUser={aiUser} scores={scores} />

      {/* Popup Modal */}
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
      return squares[a]; // Return the winner ("X" or "O")
    }
  }
  return null; // No winner
};

export default GameBoard;