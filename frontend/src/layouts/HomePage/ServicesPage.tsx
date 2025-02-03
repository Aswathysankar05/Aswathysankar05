import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuth } from '../../AuthService/AuthContext';
import './HomePageStyles.css'; // Import the CSS file for styles
import { BASE_URL } from '../../AuthService/Config';
import { sendLogToBackend } from '../../utils/logger';

interface Servicesupport {
  id: number;
  name: string;
  description: string;
  code: string;
  // other fields
}



const ServicesPage: React.FC = () => {

  const [servicesupports, setServicessupports] = useState<Servicesupport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const servicesRef = useRef<null | HTMLDivElement>(null);
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn; 
  const { logout } = useAuth();

  // const { isLoggedIn } = useContext(AuthContext); // Use context to check login status

  useEffect(() => {
    //alert("urlllllll"+BASE_URL)
      fetch(`${BASE_URL}/servicesupports`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              
              
              setServicessupports(data);
              setLoading(false);
          })
          .catch(err => {
              console.error('Fetch error:', err);
              sendLogToBackend('Fetch error: ' +err, 'error');
              setError(err.message);
              setLoading(false);
          });
  }, []);

  
  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      const Loginvalue = sessionStorage.getItem('isLoggedIn');
      const Loginemail = sessionStorage.getItem('loginemail');
      alert("Logineddd"+Loginvalue +Loginemail)
      navigate('/incidents');
    } else {
      navigate('/logins'); // Navigate to login if not logged in
    }
  };
  const handleGoIncClick = () => handleNavigation('/incidents');
 
  const handleGoReqClick = () => handleNavigation('/requests');
  
  const handleGoChgClick = () => handleNavigation('/changes');
  
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/logins'); // Optionally navigate to the login page
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  
  return (
      
      <section className="services">
    <h2>Our Services</h2>
    {/* <button onClick={handleLogout} className='btn logout-btn'>Logout</button>  */}
    <center>
    <div className="services-container"  ref={servicesRef} id='services'>
    
       <ul className='services-list'>
        
                {servicesupports.map(servicesupport => (
                   <li key={servicesupport.id}>
                     <div className="service-item">
                   
                   {servicesupport.name === 'Incident Support' && (
                    <div>
                     
                      <h2 >{servicesupport.name}</h2>
                      <p>{servicesupport.description}</p>
                      <button type='button' className='btn main-color btn-lg' onClick={handleGoIncClick}>Go</button>
                     
                    </div>
                  )}
                  {servicesupport.name === 'Request Support' && (
                    <div>
                      <h2 >{servicesupport.name}</h2>
                      <p>{servicesupport.description}</p>
                      <button type='button' className='btn main-color btn-lg' onClick={handleGoReqClick}>Go</button>
                      
                    </div>
                  )}
                  {servicesupport.name === 'Change Support' && (
                    <div>
                    
                      <h2 >{servicesupport.name}</h2>
                      <p>{servicesupport.description}</p>
                      <button type='button' className='btn main-color btn-lg' onClick={handleGoChgClick}>Go</button>
                    
                    </div>
                  )}


               </div>
              </li>

        ))}
        </ul>
      
        
       
    </div>

    </center>
  </section>
  );
};


export default ServicesPage;