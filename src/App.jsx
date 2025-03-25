import React, { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Login from "./components/Login";
import GameBoard from "./components/GameBoard";
import Footer from "./components/Footer";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [aiUser, setAIUser] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const aiNames = ["Kumail", "Karan", "Iqbal", "Mateen", "Faisal", "Shahid", "Ihtisham", "Mudasir"];

  const getRandomAIName = () => {
    const randomIndex = Math.floor(Math.random() * aiNames.length);
    return aiNames[randomIndex];
  };

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setAIUser(getRandomAIName());
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.wallpaperbetter.com/wallpaper/67/144/838/tic-tac-toe-1080P-wallpaper-middle-size.jpg')" }}
    >
      {!loggedInUser ? (
        <Login handleLogin={handleLogin} difficulty={difficulty} setDifficulty={setDifficulty} />
      ) : (
        <GameBoard loggedInUser={loggedInUser} aiUser={aiUser} difficulty={difficulty} />
      )}
      <Footer />
      <SpeedInsights />
    </div>
  );
};

export default App;