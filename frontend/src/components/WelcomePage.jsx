import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-fade-in-down">
          Welcome to Task Management
        </h1>
        <button 
          className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-blue-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={() => navigate('/login')} 
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;