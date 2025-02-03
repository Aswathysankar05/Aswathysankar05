import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthService/AuthContext';
import './AdminStyle.css';
import Dropdown from './Dropdown';
import TicketList from './TicketList';
import UsersList from './UsersList';
import AdminSettings from './AdminSettings';
import { BASE_URL } from '../AuthService/Config'
import { sendLogToBackend } from '../utils/logger';

const AdminDashboard: React.FC = () => {
  
  const handleSelect = (option: string) => {
    console.log('Selected option:', option);
  };
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const Loginvalue = sessionStorage.getItem('isLoggedIn');
  const Loginemail = sessionStorage.getItem('loginemail');
  const authToken = sessionStorage.getItem('authToken');
  const options = ['View Profile', 'Services', 'Logout'];
  const [activeComponent, setActiveComponent] = useState<string>('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // State for default data
  const [dashboardData, setDashboardData] = useState({
    welcomeMessage: "Welcome to the Admin Dashboard!",
    stats: {
      incidents: 0,
      requests: 0,
      changes: 0,
    },
  });

  useEffect(() => {
    if (!authToken) {
      navigate('/logins', { replace: true });  
  } else {
      console.log('User is authenticated. Token:', authToken);
 
      // Set active component based on the URL
      const path = location.pathname.split('/').pop();
      if (path === 'tickets') {
        setActiveComponent('tickets');
      } else if (path === 'users') { 
        setActiveComponent('users');
      } else if (path === 'settings') { 
        setActiveComponent('settings');
      }else {
        setActiveComponent('dashboard');
      }
    }

    // Fetch the counts for incidents, requests, and changes
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/incidents/count`); 
        const incidentCount = await response.json();

        const requestsResponse = await fetch(`${BASE_URL}/requests/count`); 
        const requestCount = await requestsResponse.json();

        const changesResponse = await fetch(`${BASE_URL}/changes/count`); 
        const changeCount = await changesResponse.json();

        setDashboardData(prevData => ({
          ...prevData,
          stats: {
            incidents: incidentCount,
            requests: requestCount,
            changes: changeCount,
          },
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        sendLogToBackend('Error fetching dashboard data: ' + error, 'error');
      }
    };

    fetchDashboardData();

  }, [Loginvalue, navigate, location]);

// const handleLogout = () => {
  //   logout();
  //   sessionStorage.clear();
  //   navigate('/logins', { replace: true });
  // };
  const handleLogout = () => {
    setShowLogoutConfirm(true); // Show the confirmation prompt
  };

  const handleConfirmLogout = () => {
    logout(); // Proceed with logout
    sessionStorage.clear(); // Clear session data
    navigate('/logins', { replace: true }); // Navigate to login page
  };
  
  const handleCancelLogout = () => {
    setShowLogoutConfirm(false); // Hide the confirmation modal
  };
  const handleDashboard = () => {
    setActiveComponent('dashboard');
    navigate('/admin-dashboard');
  };

  const handleTickets = () => {
    setActiveComponent('tickets');
    navigate('/admin-dashboard/tickets');
  };
  const handleUsers = () => {
    setActiveComponent('users');
    navigate('/admin-dashboard/users');
  };
  const handleSettings = () => {
    setActiveComponent('settings');
    navigate('/admin-dashboard/settings');
  };
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">

        <h2>Admin Menu</h2>
        <ul>
          <li onClick={handleDashboard}>Dashboard</li>
          <li onClick={handleTickets}>Tickets</li>
          <li onClick={handleUsers}>Users</li>
          <li onClick={handleSettings}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
          {showLogoutConfirm && (
                    <div className="logout-confirmation-modal">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={handleConfirmLogout}>Confirm</button>
                    <button onClick={handleCancelLogout}>Cancel</button>
                    </div>
                )}

        </ul>
      </aside>
      <main className="admin-mainContent">
        <header className="admin-header">
          <h1>Welcome to the Admin Dashboard</h1>
          <button>{Loginemail}</button>
          {/* <Dropdown options={options} onSelect={handleSelect} selectedLabel={Loginemail || 'Profile'} /> */}
        </header>
        <section className="admin-content">
        {activeComponent === 'dashboard' && (
            <>
              <h2>Dashboard Overview</h2>
              <p>Here you can manage your service desk operations.</p>
              <div>
            <h3>Statistics</h3>
            <ul>
              <li>Incidents: {dashboardData.stats.incidents}</li>
              <li>Requests: {dashboardData.stats.requests}</li>
              <li>Changes: {dashboardData.stats.changes}</li>
            </ul>
          </div>
            </>
          )}
          {activeComponent === 'tickets' && <TicketList />} 
          {activeComponent === 'users' && <UsersList />}
          {activeComponent === 'settings' && <AdminSettings />}
          
        </section>
      </main>
    </div>
  );
};


export default AdminDashboard;
