import React from "react";

const Login = ({ handleLogin, difficulty, setDifficulty }) => {
  return (
    <div className="bg-[rgba(0,0,0,0.1)] backdrop-blur-md p-8 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] text-center">
      <h1 className="text-3xl font-bold mb-8 text-white">Login</h1>
      <input
        type="text"
        placeholder="Enter your username"
        className="px-4 py-2 border border-gray-300 rounded-lg mb-4 w-full bg-[rgba(0,0,0,0.1)] text-white placeholder-gray-300"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleLogin(e.target.value);
          }
        }}
      />
      <div className="mb-4">
        <label className="text-white mr-2">Difficulty:</label>
        <select
          className="bg-[rgba(0,0,0,0.3)] text-white p-2 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors w-full"
        onClick={() => {
          const username = document.querySelector("input").value;
          handleLogin(username);
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;