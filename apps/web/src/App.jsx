import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import ChatInterface from "./components/ChatInterface";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ChatInterface />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
