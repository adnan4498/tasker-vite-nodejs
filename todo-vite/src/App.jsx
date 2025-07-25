import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import LoginSignupPage from "./LoginSignupPage";
import Login from "./Login";
import Settings from "./Settings";
import { AuthProvider } from "./contextAPI/AuthContext";
import OTPValidation from "./OPTValidaiton";
import Home2 from "./Home2";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignupPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/OTPValidation" element={<OTPValidation />} />
        </Routes>
      </Router>
  );
};

export default App;
