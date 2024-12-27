import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import SignIn from './components/SignIn';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import WelcomePage from './components/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/addtask" 
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edittask" 
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
