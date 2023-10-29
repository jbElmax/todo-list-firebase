
import { useEffect, useState } from 'react';
import './App.css';
import LoginForm from './components/routes/login-form/login-form.component';
import { onAuthStateChangedListener } from './utils/firebase/firebase.utils';
import HomePage from './components/routes/home-page/home-page.component';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Use 'Routes' and 'Navigate' instead of 'Switch' and 'Redirect'
import SignUpForm from './components/routes/signup-form/signup-form.component';

const App = ()=> {
  const[user,setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if(user){
        setUser(user);
        console.log(user);
      }else{
        setUser(null);
        console.log(user);
      }
    });
  
    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route to the login page when the user is not signed in */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
        <Route path="/signup" element={<SignUpForm/>}/>
        {/* Route to the home page when the user is signed in */}
        <Route path="/" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
    
  );
}

export default App;
