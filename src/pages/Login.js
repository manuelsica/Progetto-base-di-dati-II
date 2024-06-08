import React, { useState, useRef, useContext } from 'react';
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
      console.log('Generated Code:', data.code);
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
      console.log('Registration successful:', data.message);
      setConfirmationMessage('Ti sei registrato');
    } catch (error) {
      console.error('Error registering user:', error);
      setConfirmationMessage('Errore nella registrazione');
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
        setLoginMessage(true)
        navigate('/');
      } else {
        setLoginMessage(data.message);
        console.error('Login failed:', data.message);
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
                {generatedCode && <small className="generate_code">Codice generato!</small>}
                <input type="text" placeholder="Codice Univoco" value={generatedCode} readOnly />
                <div className="container_3" onClick={handleGenerateCode}>
                  <MagicButton buttonText="Genera" />
                </div>
                {confirmationMessage && <small className="generate_code">{confirmationMessage}</small>}
                <div className="container_3" onClick={handleRegisterUser}>
                  <MagicButton buttonText="Registrati" />
                </div>
              </form>
            </div>
            <div className="form-container sign-in">
              <form>
                <h1>Login</h1>
                <input type="text" name="code" placeholder="Codice univoco" ref={loginCodeRef} />
                <div className="container_3" onClick={handleLogin}>
                <MagicButton buttonText="Login" />
                </div>
                {loginMessage && <small className="generate_code">{loginMessage}</small>}
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Bentornato!</h1>
                  <p>Accedi per avere accesso a tutte le feature del sito</p>
                  <YellowButton className="hidden" id="login" onClick={handleLoginClick} buttonText="Login" />
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hey, Allenatore!</h1>
                  <p>Registrati per avere accesso a tutte le feature del sito</p>
                  <YellowButton className="hidden" id="register" onClick={handleRegisterClick} buttonText="Registrati" />
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
