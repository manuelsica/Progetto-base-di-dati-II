import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import YellowButton from '../components/YellowButton';
import MagicButton from '../components/MagicButton';
import { Helmet } from 'react-helmet';

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();
  const loginCodeRef = useRef(null);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleGenerateCode = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Generated Code:', data.code);  // Debug print
      setGeneratedCode(data.code);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleRegisterUser = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: parseInt(generatedCode) }), // Ensure code is sent as integer
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Registration successful:', data.message);  // Debug print
      setConfirmationMessage('You are in!');
    } catch (error) {
      console.error('Error registering user:', error);
      setConfirmationMessage('Register Error!');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const code = loginCodeRef.current.value;
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: parseInt(code) }),  // Ensure code is sent as integer
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful, response:", data);  // Debug print
        localStorage.setItem('token', data.access_token);
        setLoginMessage('Login successful');
        navigate('/');
      } else {
        console.error('Login failed:', data.message);  // Debug print
        setLoginMessage(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>PokeDB - Login</title>
      </Helmet>
      <Background />
      <Header />
      <section className="homepage">
        <div className="content">
          <div className={`container_login ${isActive ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
              <form>
                <h1>Genera il tuo account</h1>
                {generatedCode && <small className="generate_code">Generated Code!</small>}
                <input type="text" placeholder="Unique Code" value={generatedCode} readOnly />
                <div className="container_3" onClick={handleGenerateCode}>
                  <MagicButton buttonText="Generate" />
                </div>
                {confirmationMessage && <small className="generate_code">{confirmationMessage}</small>}
                <div className="container_3" onClick={handleRegisterUser}>
                  <MagicButton buttonText="Register" />
                </div>
              </form>
            </div>
            <div className="form-container sign-in">
              <form>
                <h1>Login</h1>
                <input type="text" name="code" placeholder="Unique Code" ref={loginCodeRef} />
                <div className="container_3" onClick={handleLogin}>
                  <MagicButton buttonText="Login" />
                </div>
                {loginMessage && <small className="generate_code">{loginMessage}</small>}
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Welcome Back!</h1>
                  <p> Log in to access all the features of the site.</p>
                  <YellowButton className="hidden" id="login" onClick={handleLoginClick} buttonText="Login" />
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hey, Trainer!</h1>
                  <p>Register to access all the features of the site</p>
                  <YellowButton className="hidden" id="register" onClick={handleRegisterClick} buttonText="Register" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
