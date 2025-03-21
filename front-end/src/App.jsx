import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp/Signup';
import Login from './pages/Login/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
      </Routes>
    </Router>
  );
};

export default App;


// import Test from "./pages/test";  // Import the Test component

// function App() {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <Test />
//     </div>
//   );
// }

// export default App;
