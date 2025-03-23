import React from "react";
import { motion } from "framer-motion";

const Popup = ({ winner, loggedInUser, aiUser, resetGame }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-white p-8 rounded-lg text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {winner ? `Winner: ${winner === "X" ? loggedInUser : aiUser}` : "It's a Draw!"}
        </h2>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </motion.div>
    </div>
  );
};

export default Popup;