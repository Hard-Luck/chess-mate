import "./App.css";
import { Route, Routes } from "react-router-dom";
import Practice from "./pages/Practice";
import Multiplayer from "./pages/Multiplayer";
import { SocketProvider } from "./contexts/SocketProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Routes>
          <Route path="/practice" element={<Practice />} />
          <Route path="/" element={<Multiplayer />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
