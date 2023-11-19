import "./App.css";
import { Route, Routes } from "react-router-dom";
import Practice from "./pages/Practice";
import Home from "./pages/Home";
function App() {
  return (
    <Routes>
      <Route path="/practice" element={<Practice />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
