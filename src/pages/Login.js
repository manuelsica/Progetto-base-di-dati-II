import React, { useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import YellowButton from '../components/YellowButton';
import MagicButton from '../components/MagicButton';

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <>
    <Background />
    <Header />
    <section className="homepage">
      <div className="content">
      <div className={`container_login ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form>
          <h1>Genera il tuo account</h1>
          <input type="text" placeholder="Codice univoco" readOnly />
          <h3 className = "generate_code">Codice generato!</h3>          
          <MagicButton buttonText="Genera"/>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1>Login</h1>
          <input type="text" placeholder="Codice univoco" />
          <MagicButton buttonText="Login" navigateTo= "/login"/>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bentornato!</h1>
            <p>Accedi per avere accesso a tutte le feature del sito</p>
            <YellowButton className="hidden" id="login" onClick={handleLoginClick} buttonText="Login" navigateTo= "/login"/>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hey, Allenatore!</h1>
            <p>Registrati per avere accesso a tutte le feature del sito</p>
            <YellowButton className="hidden" id="register" onClick={handleRegisterClick} buttonText="Registrati" navigateTo= "/login"/>
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
