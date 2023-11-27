import "./App.css";
import { Route, Routes } from "react-router-dom";
import Practice from "./pages/Practice";
import Multiplayer from "./pages/Multiplayer";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import GameProvider from "./contexts/GameProvider";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <GameProvider>
          <Routes>
            <Route path="/practice" element={<Practice />} />
            <Route path="/" element={<Multiplayer />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </GameProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
