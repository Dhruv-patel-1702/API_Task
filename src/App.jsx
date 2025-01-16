import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './Pages/Home'
import TokenWithUserDetails from './Pages/TokenWithUserDetails'
import UpdateWithoutToken from './Pages/UpdateWithoutToken'
import TokenWithUpdate from './Pages/TokenWithUpdate'
import Cards from './Pages/cards'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/token-with-user-details" element={<TokenWithUserDetails />} />
        <Route path="/update-without-token" element={<UpdateWithoutToken />} />
        <Route path="/token-with-update" element={<TokenWithUpdate />} />
        <Route path="/cards" element={<Cards />} />
      </Routes>
    </Router>
  );
}

export default App;
