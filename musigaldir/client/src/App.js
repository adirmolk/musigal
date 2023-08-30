import "./App.css";
import Nav from "./components/Nav";
import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/MainContent";
import Welcome from "./components/Welcome";
import LoginConfirm from "./components/LoginConfirm";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      
      <Route path="/" element={<Welcome/>}></Route>
      <Route path="/home" element={<Home/>}></Route>
      <Route path="/register" element={<Signup/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/confirmLogin" element={<LoginConfirm/>}></Route>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
