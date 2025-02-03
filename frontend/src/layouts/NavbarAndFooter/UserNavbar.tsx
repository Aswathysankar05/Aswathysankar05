import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthService/AuthContext';



export const UserNavbar = () => {

    const { isLoggedIn, logout } = useAuth();
    const [activeComponent, setActiveComponent] = useState<string>('usernavbar');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const Loginemail = sessionStorage.getItem('loginemail');

    const navigate = useNavigate();
    const handleUserDashboard = () => {
        setActiveComponent('user-dashboard');
        navigate('/user-dashboard');
    };

    const handleTickets = () => {
       
        navigate('/user-dashboard/viewtickets/alltickets');
    };

    const handleProfile = () => {
        setActiveComponent('user-profile');
        navigate('/user-dashboard/user-profile');
    };
    const handleRefresh = () => {
        window.location.reload();
    };
    const handleLogout = () => {
        setShowLogoutConfirm(true); 
      };

      const handleConfirmLogout = () => {
        logout(); 
        sessionStorage.clear(); 
        navigate('/logins', { replace: true }); 
      };
      
      const handleCancelLogout = () => {
        setShowLogoutConfirm(false); 
      };
    const handleIdClick = (workid: number, type: string) => {
        navigate(`/user-dashboard/viewtickets/userworkhistory/${type}/${workid}`);
    };
    const handleTktCreate = () => {
        navigate(`/user-dashboard/viewtickets/createticket/newticket`);
    };
    
    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3 '>
            <div className='container-fluid'>
                <span className='navbar-brand'>Service Desk </span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <a className='nav-link nav-btn-link' onClick={handleUserDashboard}>Dashboard</a>
                        </li>
                        <li className='nav-item'>
                           <a className='nav-link nav-btn-link'  onClick={handleTickets}> Tickets</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link nav-btn-link'  onClick={handleTktCreate}> Create</a>
                        </li>
                    </ul>

                    <ul className='navbar-nav ms-auto' >
                    <li className='nav-item'>
                            <a className='nav-link nav-btn-link'  onClick={handleProfile}> {Loginemail}</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link nav-btn-link'  onClick={handleRefresh}> Refresh</a>
                        </li>
                        <li className='nav-item' >
                            <a type='button' className='btn nav-btn-link' onClick={handleLogout}>Logout</a>
                            
                        </li>

                    </ul>
                    {showLogoutConfirm && (
                    <div className="logout-confirmation-modal">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={handleConfirmLogout}>Confirm</button>
                    <button onClick={handleCancelLogout}>Cancel</button>
                    </div>
                )}
                </div>
            </div>
        </nav>
    );
}