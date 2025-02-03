import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthService/AuthContext';
import UserProfile from './SupportProfile';
import './SupportStyle.css';
import { BASE_URL } from '../AuthService/Config';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { sendLogToBackend } from '../utils/logger';

interface StatusInfo {
    status_id: string;
    status_name: string;
}

interface Incident {
    inc_id: number;
    inc_summary: string;
	inc_priority: string;
    inc_description: string;
	contact_name: string;
	contact_email: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    statusInfo: StatusInfo;
   
}

interface Request {
    req_id: number;
    req_summary: string;
	req_priority: string;
    req_description: string;
	contact_name: string;
	contact_email: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    statusInfo: StatusInfo;
   
}

interface Change {
    chng_id: number;
    chng_summary: string;
	chng_priority: string;
    chng_description: string;
	contact_name: string;
	contact_email: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    statusInfo: StatusInfo;
   
}

function isIncident(ticket: Incident | Request | Change): ticket is Incident {
    return (ticket as Incident).inc_id !== undefined;
}

function isRequest(ticket: Incident | Request | Change): ticket is Request {
    return (ticket as Request).req_id !== undefined;
}

function isChange(ticket: Incident | Request | Change): ticket is Change {
    return (ticket as Change).chng_id !== undefined;
}

const SupportDashboard: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const [activeComponent, setActiveComponent] = useState<string>('supportdashboard');
    const [loadingChanges, setLoadingchanges] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [changes, setChanges] = useState<Change[]>([]);
    const [loadingIncidents, setLoadingIncidents] = useState<boolean>(true);
    const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
    const [activeTicketCount, setActiveTicketCount] = useState<number>(0);
    const [criticalTicketCount, setCriticalTicketCount] = useState<number>(0);
    const [totalActiveTickets, setTotalActiveTickets] = useState<number>(0);
    const [totalCriticalTickets, setTotalCriticalTickets] = useState<number>(0);
    const authToken = sessionStorage.getItem('authToken');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [incdataAvailable, setIncDataAvailable] = useState<boolean>(false); 
    const [reqdataAvailable, setReqDataAvailable] = useState<boolean>(false); 
    const [chngdataAvailable, setChngDataAvailable] = useState<boolean>(false); 


    const [dashboardData, setDashboardData] = useState({
        welcomeMessage: "Welcome to the Support Dashboard!",
        stats: {
            incidents: 0,
            requests: 0,
            changes: 0,
        },
        latestTickets: [], 
        activeTickets: [], 
        criticalTickets: [] 
    });
    
    const [supportdashboardData, setSupportDashboardData] = useState({
        welcomeMessage: "Welcome to the Support Dashboard!",
        stats: {
            activeincidents: 0,
            activerequests: 0,
            activechanges: 0,
        },
       
    });

    useEffect(() => {
        // if (!Loginvalue) {
        //     navigate('/logins', { replace: true });
        // } 
        if (!authToken) {
            navigate('/logins', { replace: true });  
        } else {
            console.log('User is authenticated. Token:', authToken);
        }
        
         // Fetch the counts for incidents, requests, and changes
    const fetchDashboardData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/incidents/count`); // Fetch incidents count
          const incidentCount = await response.json();
  
          const requestsResponse = await fetch(`${BASE_URL}/requests/count`); // Fetch requests count
          const requestCount = await requestsResponse.json();
  
          const changesResponse = await fetch(`${BASE_URL}/changes/count`); // Fetch changes count
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
  
        // Fetch Active and Critical Tickets Count
        const fetchActiveTicketCount = async () => {
            try {
                const incidentsResponse = await fetch(`${BASE_URL}/incidents`);
                const requestsResponse = await fetch(`${BASE_URL}/requests`);
                const changesResponse = await fetch(`${BASE_URL}/changes`);

                if (!incidentsResponse.ok || !requestsResponse.ok || !changesResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const incidents = await incidentsResponse.json();
                const requests = await requestsResponse.json();
                const changes = await changesResponse.json();

                
                const activeIncidents = incidents.filter((ticket: Incident) => ticket.statusInfo.status_id && ticket.statusInfo.status_id !== "2");
                const activeRequests = requests.filter((ticket: Request) => ticket.statusInfo.status_id && ticket.statusInfo.status_id !== "2");
                const activeChanges = changes.filter((ticket: Change) => ticket.statusInfo.status_id && ticket.statusInfo.status_id !== "2");
               
                const totalActive = activeIncidents.length + activeRequests.length + activeChanges.length;
                setTotalActiveTickets(totalActive);
            } catch (error) {
                console.error('Error fetching active ticket count:', error);
                sendLogToBackend('Error fetching active ticket count: ' + error, 'error');
            }
        };

         const fetchCriticalTicketCount = async () => {
            try {
                const inccrtresponse = await fetch(`${BASE_URL}/incidents/critical-count`); 
                const inccrtcount = await inccrtresponse.json();

                const reqcrtresponse = await fetch(`${BASE_URL}/requests/critical-count`);
                const reqcrtcount = await reqcrtresponse.json();

                const chngcrtresponse = await fetch(`${BASE_URL}/changes/critical-count`); 
                const chngcrtcount = await chngcrtresponse.json();

                const totalCritical = inccrtcount + reqcrtcount + chngcrtcount;
                setTotalCriticalTickets(totalCritical);
            } catch (error) {
                console.error('Error fetching critical ticket count:', error);
                sendLogToBackend('Error fetching critical ticket count: ' + error, 'error');
            }
        };

    fetchDashboardData();
    fetchActiveTicketCount();
    fetchCriticalTicketCount();

//Fetch incidents
fetch(`${BASE_URL}/incidents`)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
     if (Array.isArray(data) && data.length > 0) {
        
                const sortedIncidents = data
                    .filter((incident): incident is Incident => incident.created_at !== undefined)
                    .sort((a: Incident, b: Incident) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        
                        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                            console.warn('Invalid date:', a.created_at, b.created_at);
                            return 0; 
                        }
                        return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 2);
                    if(sortedIncidents.length > 0){
                        setIncDataAvailable(true);
                    }
                    else{
                        setIncDataAvailable(false);
                    }

                    setIncidents(sortedIncidents);
   
    }
    else {
        console.warn('No incidents found or invalid data structure.');
        sendLogToBackend('No incidents found or invalid data structure. ', 'error');
    }
        setLoadingIncidents(false);
})
.catch(err => {
    console.error('Fetch error:', err);
    setError(err.message);
    setLoadingIncidents(false);
    setIncDataAvailable(false);
});



// Fetch requests
fetch(`${BASE_URL}/requests`)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
     
               const sortedRequests = data
                   .filter((request): request is Request => request.created_at !== undefined)
                   .sort((a: Request, b: Request) => {
                    const dateA = new Date(a.created_at);
                       const dateB = new Date(b.created_at);
                       
                       if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                           console.warn('Invalid date:', a.created_at, b.created_at);
                           return 0; 
                       }
                       return dateB.getTime() - dateA.getTime();
                   })
                   .slice(0, 2);
                   if(sortedRequests.length > 0){
                    setReqDataAvailable(true);
                    }
                    else{
                    setReqDataAvailable(false);
                    }
                   setRequests(sortedRequests);
   }
   else {
       console.warn('No incidents found or invalid data structure.');
       sendLogToBackend('No incidents found or invalid data structure', 'error');
   }
       setLoadingRequests(false);
})
.catch(err => {
    console.error('Fetch error:', err);
    setError(err.message);
    setLoadingRequests(false);
    setReqDataAvailable(false);
});

//Fetch Changes

fetch(`${BASE_URL}/changes`)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    if (Array.isArray(data) && data.length > 0) {
       
               const sortedChanges = data
                   .filter((change): change is Change => change.created_at !== undefined)
                   .sort((a: Change, b: Change) => {
                       const dateA = new Date(a.created_at);
                       const dateB = new Date(b.created_at);
                       
                       if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                           console.warn('Invalid date:', a.created_at, b.created_at);
                           return 0; 
                       }
                       return dateB.getTime() - dateA.getTime();
                   })
                   .slice(0, 2);
                   if(sortedChanges.length > 0){
                    setChngDataAvailable(true);
                    }
                    else{
                    setChngDataAvailable(false);
                    }
                   setChanges(sortedChanges);
   }
   else {
       console.warn('No incidents found or invalid data structure.');
       sendLogToBackend('No incidents found or invalid data structure', 'error');
   }
   setLoadingchanges(false);
})
.catch(err => {
    console.error('Fetch error:', err);
    setError(err.message);
    setLoadingchanges(false);
    setChngDataAvailable(false);
});



    }, [Loginvalue, navigate, location]);

    // Check if any of the ticket types have data
const isAnyTicketDataAvailable = incdataAvailable || reqdataAvailable || chngdataAvailable;

    const handleSupportDashboard = () => {
        // setActiveComponent('user-dashboard');
        navigate('/support-dashboard');
    };

    const handleTickets = () => {
       
        navigate('/support-dashboard/supportviewtickets/alltickets');
        //window.location.reload();
    };

    const handleProfile = () => {
        // setActiveComponent('support-profile');
        navigate('/support-dashboard/support-profile');
    };
    const handleRefresh = () => {
        window.location.reload();
    };

    // const handleLogout = () => {
    //     logout();
    //     sessionStorage.clear();
    //     navigate('/logins', { replace: true });
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
    
    const handleIdClick = (workid: number, type: string) => {
        navigate(`/support-dashboard/userworkhistory/${type}/${workid}`);
        
    };

    const pieData = [
        { name: "Incidents", value: dashboardData.stats.incidents },
        { name: "Requests", value: dashboardData.stats.requests },
        { name: "Change Requests", value: dashboardData.stats.changes },
        { name: "Active Tickets", value: totalActiveTickets },
        { name: "Critical Tickets", value: totalCriticalTickets },
    ];

    const COLORS = ["#8884d8", "#ff8042", "#0088fe", "#82ca9d", "#f21d1d"];
    
    const sortedTickets = [...incidents, ...requests, ...changes].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const handleTktCreate = () => {
        navigate(`/support-dashboard/supportviewtickets/createticket/newticket`);
    };
   
    return (
        <div className="user-dashboard">
            <nav className='navbar navbar-expand-lg navbar-dark main-color'>
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
                            <a className='nav-link nav-btn-link' onClick={handleSupportDashboard}>Dashboard</a>
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
            {/* <nav className="usernavbar-header">
			<div className="usernavbar-content">
			
        	<span className="user-head">Service Desk</span>
            <div className="usernavbar-links">
            <div className="left-links">
                <a href="#" className="user-link" onClick={handleSupportDashboard}>Dashboard</a>
                <a href="#" className="user-link" onClick={handleTickets}>Tickets</a>
                <a href="#" onClick={handleTktCreate} className="user-link">Create </a>
            </div>
            <div className="right-links">
                <a href="#" className="user-link" onClick={handleProfile}>{Loginemail}</a>
                <a href="#" className="user-link" onClick={handleRefresh}>Refresh</a>
                <a href="#" className="user-link" onClick={handleLogout}>Logout</a>
                {showLogoutConfirm && (
                    <div className="logout-confirmation-modal">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={handleConfirmLogout}>Confirm</button>
                    <button onClick={handleCancelLogout}>Cancel</button>
                    </div>
                )}
            </div>
           </div>
			</div>
		</nav> */}
            
            <main className="user-mainContent">
                
                <section className="user-content">
                    {/* {activeComponent === 'support-dashboard' && (
                        <> */}
                            <h5>Manage Tickets</h5>
                            <div className="user-dashboard-cards">
                                <Link to="/support-dashboard/supportviewtickets/incidents" className="user-card">
                                    <h5>Incidents</h5>
                                    <p>{dashboardData.stats.incidents}</p>
                                </Link>
                                <Link to="/support-dashboard/supportviewtickets/requests" className="user-card">
                                    <h5>Requests</h5>
                                    <p>{dashboardData.stats.requests}</p>
                                </Link>
                                <Link to="/support-dashboard/supportviewtickets/changes" className="user-card">
                                    <h5>Change Requests</h5>
                                    <p>{dashboardData.stats.changes}</p>
                                </Link>
                            </div>
                           <h5> Review Your Works</h5>
                            <div className="user-dashboard-latest-tickets">
                                <div className="user-latest-tickets" style={{ width: '80%' }}>
                                    <h3>Latest Tickets</h3>
                                    {/* {(incdataAvailable === false || reqdataAvailable === false || chngdataAvailable === false) ? ( */}
                                    {!isAnyTicketDataAvailable ? (
                                        <p>No data available for your tickets.</p> // Show this message if no data is available
                                    ) : (
                                    <div className='container user-container-width '>

                                        <div className='table-responsive'>
                                            <table className='table table-hover user-table '>
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Summary</th>
                                                    <th>Created By</th>
                                                    <th>Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    
                                                       {sortedTickets.map((ticket) => (
                                                        <tr key={isIncident(ticket) ? ticket.inc_id : isRequest(ticket) ? ticket.req_id : (ticket as Change).chng_id}>
                                                            <td>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (isIncident(ticket)) {
                                                                            handleIdClick(ticket.inc_id, 'incidents');
                                                                        } else if (isRequest(ticket)) {
                                                                            handleIdClick(ticket.req_id, 'requests');
                                                                        } else if (isChange(ticket)) {
                                                                            handleIdClick(ticket.chng_id, 'changes');
                                                                        }
                                                                    }}
                                                                >
                                                                    {isIncident(ticket) ? `INC${ticket.inc_id}` : isRequest(ticket) ? `REQ${ticket.req_id}` : `CHG${ticket.chng_id}`}
                                                                </a>
                                                            </td>
                                                            <td>{isIncident(ticket) ? ticket.inc_summary : isRequest(ticket) ? ticket.req_summary : (ticket as Change).chng_summary}</td>
                                                            <td>{ticket.created_by}</td>
                                                            <td>{ticket.statusInfo ? ticket.statusInfo.status_name : 'N/A'}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                     )}
                                </div>
                            
                            <div className="user-dashboard-new-cards">
                                <div className="active-tickets-card">
                                    <ul>
                                        <li>
                                            <Link to="/support-dashboard/supportviewtickets/active">Active Tickets ({totalActiveTickets})</Link>
                                        </li>
                                        <li>
                                            <Link to="/support-dashboard/supportviewtickets/critical">Critical Tickets ({totalCriticalTickets})</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="diagram-tickets-card">
                                    <PieChart width={300} height={500}>
                                    {/* {(incdataAvailable === false || reqdataAvailable === false || chngdataAvailable === false) ? ( */}
                                    {!isAnyTicketDataAvailable ? (
                                        <p>No data available for your tickets.</p> // Show this message if no data is available
                                    ) : (
                                        <Pie
                                            data={pieData}
                                            cx="40%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                         )}
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                    
                                </div>
                            </div>
                        </div>
                        {/* </>
                    )} */}
                    {/* {activeComponent === 'user-tickets' && <UserTickets />}
                    {activeComponent === 'user-profile' && <UserProfile />} */}
                </section>
            </main>
        </div>
    );
};

export default SupportDashboard;
