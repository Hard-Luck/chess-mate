import "./App.css";
import { Route, Routes } from "react-router-dom";
import Practice from "./pages/Practice";
import Multiplayer from "./pages/Multiplayer";
import { SocketProvider } from "./contexts/SocketProvider";
function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Practice />} />
        <Route path="/challenge" element={<Multiplayer />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
