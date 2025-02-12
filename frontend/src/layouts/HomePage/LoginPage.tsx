import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthService/AuthContext';
import { Navbar } from '../NavbarAndFooter/Navbar';
import './HomePageStyles.css';
import { BASE_URL } from '../../AuthService/Config';
import { sendLogToBackend } from '../../utils/logger';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage: React.FC = () => {
 
  const [email, setEmail] = useState('');
  const [pswd, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [captchaToken, setCaptchaToken] = useState('');
  const [isCaptchaReady, setIsCaptchaReady] = useState(false)

  const RECAPTCHA_SITE_KEY = '6LdspdQqAAAAAAyeD-WZGeLaBgBmf0r0OvCVYcS4';
  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaToken(token);
      console.log('Captcha Token:', token);
    } else {
      setCaptchaToken('');
      console.log('Captcha verification failed.');
    }
  };
    const handleLoginForm =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      if (!captchaToken) {
        alert('Please complete the CAPTCHA.');
        return;
    }

        setLoading(true);
       // const loginObj = { email, pswd };
        const loginObj = { email, pswd, captchaResponse: captchaToken };
        try {

          const response = await fetch(`${BASE_URL}/logins`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginObj),
          });
    
          if (response.ok) {

            const loginmsg = await response.text();
            const responseObject = JSON.parse(loginmsg);
            console.log('Login successful:', +isLoggedIn);
            sendLogToBackend('Loggined with email: ' + email, 'info');
            sessionStorage.setItem('loginemail', responseObject.useremail);
            sessionStorage.setItem('authToken', captchaToken);
            console.log('Token stored:', captchaToken);
            const role =  responseObject.role;
            if(role == "User"){
              login(); 
              navigate('/user-dashboard'); 
            }
          
            if(role == "Admin"){
              login(); 
              navigate('/admin-dashboard'); 
            }
            if(role == "Support"){
              login(); 
              navigate('/support-dashboard'); 
            }

          } else {
          
            console.error('Login failed: ', response.status); 
            alert('Invalid email or password. Please try again.');
            sendLogToBackend('Invalid email or password. Please try again.' + email, 'error');
            
          }
        } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred. Please try again later.');
          sendLogToBackend('Error during login: ' + email, 'error');
        } finally {
          setLoading(false);
        }


      };
    
  
return (
 <div> <Navbar/>
    <div className="login-container">
      
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleLoginForm} className="login-form">
    
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="pswd"
            value={pswd}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

        <button type="submit" className="login-button" disabled={loading}> {loading ? 'Logging in...' : 'Login'}</button>
      
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
