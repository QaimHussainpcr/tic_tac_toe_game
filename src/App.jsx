import React, { useState } from "react";
import Login from "./components/Login";
import GameBoard from "./components/GameBoard";
import Footer from "./components/Footer";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const [aiUser, setAIUser] = useState(""); 

  // List of AI names
  const aiNames = ["Kumail", "Karan", "Iqbal", "Mateen", "Faisal", "Shahid", "Ihtisham", "Mudasir"];

  // Function to get a random AI name
  const getRandomAIName = () => {
    const randomIndex = Math.floor(Math.random() * aiNames.length);
    return aiNames[randomIndex];
  };

  // Login function
  const handleLogin = (username) => {
    setLoggedInUser(username);
    setAIUser(getRandomAIName()); // Set a random AI name when the user logs in
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.wallpaperbetter.com/wallpaper/67/144/838/tic-tac-toe-1080P-wallpaper-middle-size.jpg')" }} // Set background image
    >
      {!loggedInUser ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <GameBoard loggedInUser={loggedInUser} aiUser={aiUser} />
      )}
      <Footer />
    </div>
  );
};

export default App;