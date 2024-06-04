import React, { useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import YellowButton from '../components/YellowButton';
import MagicButton from '../components/MagicButton';
import { Helmet } from 'react-helmet';

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

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
        console.log('Generated Code:', data.code); // Debugging: Log the code to the console
        setGeneratedCode(data.code);
    } catch (error) {
        console.error('Error generating code:', error);
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
                <MagicButton buttonText="Registrati" />
              </form>
            </div>
            <div className="form-container sign-in">
              <form>
                <h1>Login</h1>
                <input type="text" placeholder="Codice univoco" />
                <MagicButton buttonText="Login" navigateTo="/login" />
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Bentornato!</h1>
                  <p>Accedi per avere accesso a tutte le feature del sito</p>
                  <YellowButton className="hidden" id="login" onClick={handleLoginClick} buttonText="Login" navigateTo="/login" />
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hey, Allenatore!</h1>
                  <p>Registrati per avere accesso a tutte le feature del sito</p>
                  <YellowButton className="hidden" id="register" onClick={handleRegisterClick} buttonText="Registrati" navigateTo="/login" />
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

