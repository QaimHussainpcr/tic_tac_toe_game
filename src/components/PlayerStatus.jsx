import React from "react";

const PlayerStatus = ({ status, loggedInUser, aiUser, scores }) => {
  return (
    <div className="bg-[rgba(99,98,98,0.7)] p-6 rounded-lg shadow-lg mt-6 text-center">
      <p className="text-3xl font-bold text-white">{status}</p>
      <div className="mt-4 text-2xl font-semibold text-white">
        <p>{loggedInUser}: {scores.User}</p>
        <p>{aiUser}: {scores.AI}</p>
      </div>
    </div>
  );
};

export default PlayerStatus;