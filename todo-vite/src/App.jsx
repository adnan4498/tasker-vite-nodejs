import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/sign" element={<Signup />} />{" "}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
