
import { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import '../layouts/OurServices/IncidentServices/Incident.css';
import { BASE_URL } from '../AuthService/Config';
import { useAuth } from '../AuthService/AuthContext';
import { faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    status: string;
    
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

type Ticket = Incident | Request | Change;

const ViewTickets: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const { type } = useParams();
    const [tickets, setTickets] = useState<(Incident | Request | Change)[]>([]);
    const [allTickets, setAllTickets] = useState<(Incident | Request | Change)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState<string>('viewtickets');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(6);
    const authToken = sessionStorage.getItem('authToken');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        // if (!Loginvalue) {
        //     navigate('/logins', { replace: true });
        // }
        if (!authToken) {
            navigate('/logins', { replace: true });  
        } else {
            console.log('User is authenticated. Token:', authToken);
        }
        const fetchTickets = async () => {
            setLoading(true);
            try {
                let fetchedTickets: (Incident | Request | Change)[] = [];

                if (type === 'incidents') {
                    const incidents = await fetch(`${BASE_URL}/incidents`).then(res => res.json());
                    fetchedTickets = incidents.filter((ticket: Incident) => ticket.created_by === Loginemail);
                    //fetchedTickets = incidents;
                } else if (type === 'requests') {
                    const requests = await fetch(`${BASE_URL}/requests`).then(res => res.json());
                    fetchedTickets = requests.filter((ticket: Request) => ticket.created_by === Loginemail);
                    //fetchedTickets = requests;
                } else if (type === 'changes') {
                    const changes = await fetch(`${BASE_URL}/changes`).then(res => res.json());
                    fetchedTickets = changes.filter((ticket: Change) => ticket.created_by === Loginemail);
                    //fetchedTickets = changes;
                } else if (type === 'alltickets') {
                    const [incidents, requests, changes] = await Promise.all([
                        fetch(`${BASE_URL}/incidents`).then(res => res.json()),
                        fetch(`${BASE_URL}/requests`).then(res => res.json()),
                        fetch(`${BASE_URL}/changes`).then(res => res.json())
                    ]);
                    fetchedTickets = [
                        ...incidents.filter((ticket: Incident) => ticket.created_by === Loginemail),
                        ...requests.filter((ticket: Request) => ticket.created_by === Loginemail),
                        ...changes.filter((ticket: Change) => ticket.created_by === Loginemail)
                    ];
                    //fetchedTickets = [...incidents, ...requests, ...changes];
                }
                else if (type === 'active') {
                    const [incidents, requests, changes] = await Promise.all([
                        fetch(`${BASE_URL}/incidents`).then(res => res.json()),
                        fetch(`${BASE_URL}/requests`).then(res => res.json()),
                        fetch(`${BASE_URL}/changes`).then(res => res.json())
                    ]);
                    fetchedTickets = [
                        ...incidents.filter((ticket: Incident) => ticket.statusInfo.status_id !== '2' && ticket.statusInfo.status_id !== null && ticket.created_by === Loginemail),
                        ...requests.filter((ticket: Request) => ticket.statusInfo.status_id !== '2' && ticket.statusInfo.status_id !== null && ticket.created_by === Loginemail),
                        ...changes.filter((ticket: Change) => ticket.statusInfo.status_id !== '2' && ticket.statusInfo.status_id !== null && ticket.created_by === Loginemail)
                    ];
                }else if (type === 'critical') {
                    // Fetch all tickets and filter by priority level "P1"
                    const [incidents, requests, changes] = await Promise.all([
                        fetch(`${BASE_URL}/incidents`).then(res => res.json()),
                        fetch(`${BASE_URL}/requests`).then(res => res.json()),
                        fetch(`${BASE_URL}/changes`).then(res => res.json())
                    ]);

                    fetchedTickets = [
                        ...incidents.filter((ticket: Incident) => ticket.inc_priority === 'P1' && ticket.created_by === Loginemail),
                        ...requests.filter((ticket: Request) => ticket.req_priority === 'P1' && ticket.created_by === Loginemail),
                        ...changes.filter((ticket: Change) => ticket.chng_priority === 'P1' && ticket.created_by === Loginemail)
                    ];
                }

                // Sort all tickets by `created_at` date in descending order
                const sortedTickets = fetchedTickets.sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                // Only set tickets if there is any data
                if (sortedTickets.length > 0) {
                    setAllTickets(sortedTickets);
                    setTickets(sortedTickets);
                } else {
                    setAllTickets([]);
                    setTickets([]); 
                }
                               
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load tickets');
                sendLogToBackend('Failed to load tickets:' + err, 'error');
                setLoading(false);
            }
        };


        fetchTickets();

    }, [type, Loginemail, navigate]);

    const totalPages = Math.ceil(tickets.length / itemsPerPage);
    
    const currentTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
    const handlePageChange = (page: number) => {
      
        setCurrentPage(page);
    };

     if (loading) return <p>Loading...</p>;
     if (error) return <p>Error: {error}</p>;

    function addNewIncident() {
        navigate('/add-incident')
    }
    const handleUserDashboard = () => {
        setActiveComponent('user-dashboard');
        navigate('/user-dashboard');
    };

    const handleTickets = () => {
        navigate('/user-dashboard/viewtickets/alltickets');
        window.location.reload();
    };

    const handleProfile = () => {
        setActiveComponent('user-profile');
        navigate('/user-dashboard/user-profile');
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

    // const handleSearch = () => {
        
    //     const filteredTickets = tickets.filter(ticket => {
    //         let ticketId = '';
    //         if ('inc_id' in ticket) {
    //             ticketId = `INC${ticket.inc_id}`;
    //         } else if ('req_id' in ticket) {
    //             ticketId = `REQ${ticket.req_id}`;
    //         } else if ('chng_id' in ticket) {
    //             ticketId = `CHNG${ticket.chng_id}`;
    //         }
    
    //          const lowerSearchTerm = searchTerm.toLowerCase();
    //         return (
    //             ticketId.toLowerCase().includes(lowerSearchTerm) ||
    //             ('inc_summary' in ticket ? ticket.inc_summary : 'req_summary' in ticket ? ticket.req_summary : ticket.chng_summary).toLowerCase().includes(lowerSearchTerm)
    //         );
    //     });
    
    //     setTickets(filteredTickets);
    // };
    // Function to handle input change
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    const newSearchTerm = e.target.value; 
    setSearchTerm(newSearchTerm); 
    handleNewSearch(newSearchTerm); 
};
const handleNewSearch = (searchValue: string) => {

   
    const filteredTickets = allTickets.filter(ticket => {
        let ticketId = '';
        if ('inc_id' in ticket) {
            ticketId = `INC${ticket.inc_id}`;
        } else if ('req_id' in ticket) {
            ticketId = `REQ${ticket.req_id}`;
        } else if ('chng_id' in ticket) {
            ticketId = `CHNG${ticket.chng_id}`;
        }

        const lowerSearchTerm = searchValue.toLowerCase(); // Use the passed search value
        return (
            ticketId.toLowerCase().includes(lowerSearchTerm) ||
            ('inc_summary' in ticket ? ticket.inc_summary : 'req_summary' in ticket ? ticket.req_summary : ticket.chng_summary).toLowerCase().includes(lowerSearchTerm)
        );
    });

    setTickets(filteredTickets); // Set the filtered tickets based on search
    setCurrentPage(1);
};
//  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setSearchTerm(e.target.value); 
//     alert("changeeeeeeee"+searchTerm)
//  };
// Function to handle search (called on button click)
const handleSearch = () => {
    const filteredTickets = allTickets.filter(ticket => {
        let ticketId = '';
        if ('inc_id' in ticket) {
            ticketId = `INC${ticket.inc_id}`;
        } else if ('req_id' in ticket) {
            ticketId = `REQ${ticket.req_id}`;
        } else if ('chng_id' in ticket) {
            ticketId = `CHNG${ticket.chng_id}`;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            ticketId.toLowerCase().includes(lowerSearchTerm) ||
            ('inc_summary' in ticket ? ticket.inc_summary : 'req_summary' in ticket ? ticket.req_summary : ticket.chng_summary).toLowerCase().includes(lowerSearchTerm)
        );
    });

    setTickets(filteredTickets);
    setCurrentPage(1);
};
    const handleIncCreate = () => {
        navigate(`/user-dashboard/viewtickets/createticket/${type}`);
    };

    const handleReqCreate = () => {
        navigate(`/user-dashboard/viewtickets/createticket/${type}`);
    };
    const handleChngCreate = () => {
        navigate(`/user-dashboard/viewtickets/createticket/${type}`);
    };
    const handleTktCreate = () => {
        navigate(`/user-dashboard/viewtickets/createticket/newticket`);
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
                            <a className='nav-link nav-btn-link' onClick={handleUserDashboard}>Dashboard</a>
                        </li>
                        <li className='nav-item'>
                           <a className='nav-link nav-btn-link'  onClick={handleTickets}> Tickets</a>
                        </li>
                        <li className='nav-item'>
                        <div className="center-search">
                       <input
                        type="text"
                        className="search-input"
                        placeholder="Search by ID or Summary..."
                        value={searchTerm}
                        onChange={handleInputChange}  
                        />
                        <button className="search-button" onClick={handleSearch}>  
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        
                    </div>
                    </li>
                       
                    </ul>

                    <ul className='navbar-nav ms-auto' >
                    <li className='nav-item'>
						
                        {/* <a className='nav-link nav-btn-link'  onClick={handleTktCreate}> Create</a> */}
                        
                     {type === 'incidents' ? (
                    <a onClick={handleIncCreate} className="nav-link nav-btn-link">Create Incident</a>
                ) : null}
                {type === 'requests' ? (
                    <a onClick={handleReqCreate} className="nav-link nav-btn-link">Create Request</a>
                ) : null}

                {type === 'changes' ? (
                    <a onClick={handleChngCreate} className="nav-link nav-btn-link">Create Change Request</a>
                ) : null}
                {type === 'alltickets' ? (
                    <a onClick={handleTktCreate} className="nav-link nav-btn-link">Create </a>
                ) : null}
                   </li>
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
                        <a href="#" className="user-link" onClick={handleUserDashboard}>Dashboard</a>
                        <a href="#" className="user-link" onClick={handleTickets}>Tickets</a>
                    </div>
                    <div className="center-search">
                       <input
                        type="text"
                        className="search-input"
                        placeholder="Search by ID or Summary..."
                        value={searchTerm}
                        onChange={handleInputChange}  
                        />
                        <button className="search-button" onClick={handleSearch}>  
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        
                    </div>
                    <div className="right-links">
                    {type === 'incidents' ? (
                        <a href="#" onClick={handleIncCreate} className="user-link">Create Incident</a>
                    ) : null}
                    {type === 'requests' ? (
                        <a href="#" onClick={handleReqCreate} className="user-link">Create Request</a>
                    ) : null}

                    {type === 'changes' ? (
                        <a href="#" onClick={handleChngCreate} className="user-link">Create Change Request</a>
                    ) : null}
                    {type === 'alltickets' ? (
                        <a href="#" onClick={handleTktCreate} className="user-link">Create </a>
                    ) : null}


                        <a href="#" className="user-link" onClick={handleProfile}>Profile</a>
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

        <div className="ticket-list">
          
            {tickets.length === 0 ? (
                    <p>No data available for your tickets.</p> 
                ) : (
            <table aria-label="Ticket List">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Summary</th>
                        <th>Description</th>
                        <th>Created By</th>
                        <th>Assigned To</th>
                        <th>Created At</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTickets.map(ticket => {
                        let ticketId: string;
                        let workid: string;
                        let type: string;
                        if ('inc_id' in ticket) {
                            ticketId = `INC${ticket.inc_id}`;
                            workid = ticket.inc_id.toString();
                            type= "incidents";
                        } else if ('req_id' in ticket) {
                            ticketId = `REQ${ticket.req_id}`;
                            workid = ticket.req_id.toString();
                            type= "requests";
                        } else if ('chng_id' in ticket) {
                            ticketId = `CHNG${ticket.chng_id}`;
                            workid = ticket.chng_id.toString();
                            type= "changes";
                        } else {
                            ticketId = 'UNKNOWN';
                            workid = '0';
                        }

                        return (
                            <tr key={ticketId} 
                            // onClick={() => navigate(`/user-dashboard/viewtickets/userworkhistory/${type}/${workid}`)}
                            > 
                                <td><a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate(`/user-dashboard/viewtickets/userworkhistory/${type}/${workid}`);
                                }}
                                className="ticket-id-link"
                                >
                                    {ticketId}</a>
                                    </td>
                                <td>{'inc_summary' in ticket ? ticket.inc_summary : 'req_summary' in ticket ? ticket.req_summary : ticket.chng_summary}</td>
                                <td>{'inc_description' in ticket ? ticket.inc_description : 'req_description' in ticket ? ticket.req_description : ticket.chng_description}</td>
                                <td>{ticket.created_by}</td>
                                <td>{ticket.assignmentgroup}</td>
                                <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                <td>{'status' in ticket ? ticket.status : ticket.statusInfo?.status_name}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            )}

            <div className="pagination-container">
            <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => handlePageChange(index + 1)} 
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
           </div>
        </div>
    </div>

    );
};

export default ViewTickets;
