
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../AuthService/Config'
import { sendLogToBackend } from '../utils/logger';

interface StatusInfo {
    status_id: string;
    status_name: string;
}
interface Incident {
    inc_id: number;
    inc_summary: string;
    inc_description: string;
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
    req_description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    statusInfo: StatusInfo;
    // other fields
}

interface Change {
    chng_id: number;
    chng_summary: string;
    chng_description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    statusInfo: StatusInfo;
    // other fields
}

const TicketList: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [changes, setChanges] = useState<Change[]>([]);
    const [loadingIncidents, setLoadingIncidents] = useState<boolean>(true);
    const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
    const [loadingChanges, setLoadingchanges] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const authToken = sessionStorage.getItem('authToken');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [inccurrentPage, setIncCurrentPage] = useState<number>(1);
    const [reqcurrentPage, setReqCurrentPage] = useState<number>(1);
    const [chngcurrentPage, setChngCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;
    const incitemsPerPage = 3;
    const reqitemsPerPage = 3;
    const chngitemsPerPage = 3;

    useEffect(() => {
        if (!authToken) {
            navigate('/logins', { replace: true });  
        } else {
            console.log('User is authenticated. Token:', authToken);
        }
        

fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const [incidentsRes, requestsRes, changesRes] = await Promise.all([
                fetch(`${BASE_URL}/incidents`),
                fetch(`${BASE_URL}/requests`),
                fetch(`${BASE_URL}/changes`),
            ]);
            const [incidentsData, requestsData, changesData] = await Promise.all([
                incidentsRes.json(),
                requestsRes.json(),
                changesRes.json(),
            ]);

            setIncidents(incidentsData);
            setRequests(requestsData);
            setChanges(changesData);
        } catch (err) {
            setError('Failed to fetch data');
            sendLogToBackend('Failed to fetch data ', 'error');
        } finally {
            setLoading(false);
        }
    };
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleIncPageChange = (pageNumber: number) => {
        setIncCurrentPage(pageNumber);
    };
    const handleReqPageChange = (pageNumber: number) => {
        setReqCurrentPage(pageNumber);
    };

    const handleChngPageChange = (pageNumber: number) => {
        setIncCurrentPage(pageNumber);
    };


    const paginatedData = (data: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };
    const incpaginatedData = (data: any[]) => {
        const startIndex = (inccurrentPage - 1) * incitemsPerPage;
        return data.slice(startIndex, startIndex + incitemsPerPage);
    };
    const reqpaginatedData = (data: any[]) => {
        const startIndex = (reqcurrentPage - 1) * reqitemsPerPage;
        return data.slice(startIndex, startIndex + reqitemsPerPage);
    };
    const chngpaginatedData = (data: any[]) => {
        const startIndex = (chngcurrentPage - 1) * chngitemsPerPage;
        return data.slice(startIndex, startIndex + chngitemsPerPage);
    };

    const increnderTickets = (tickets: any[], type: string) => {
        return (
            <>
                {tickets.map(ticket => (
                    <tr key={ticket.id}>
                        <td>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleIdClick(ticket.inc_id, "incidents");
                                }}
                            >
                               INC{ticket.inc_id}
                            </a>
                        </td>
                        {/* <td>{ticket.inc_id}</td> */}
                        <td>{ticket.inc_summary}</td>
                        <td>{ticket.created_by}</td>
                        <td>{ticket.statusInfo ? ticket.statusInfo.status_name : 'N/A'}</td>
                    </tr>
                ))}
            </>
        );
    };
    const reqrenderTickets = (tickets: any[], type: string) => {
        return (
            <>
                {tickets.map(ticket => (
                    <tr key={ticket.req_id}>
                        <td>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleIdClick(ticket.req_id, "requests");
                                }}
                            >
                               REQ{ticket.req_id}
                            </a>
                        </td>
                        {/* <td>{ticket.inc_id}</td> */}
                        <td>{ticket.req_summary}</td>
                        <td>{ticket.created_by}</td>
                        <td>{ticket.statusInfo ? ticket.statusInfo.status_name : 'N/A'}</td>
                    </tr>
                ))}
            </>
        );
    };
    const chngrenderTickets = (tickets: any[], type: string) => {
        return (
            <>
                {tickets.map(ticket => (
                    <tr key={ticket.chng_id}>
                        <td>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleIdClick(ticket.chng_id, "changes");
                                }}
                            >
                               CHNG{ticket.chng_id}
                            </a>
                        </td>
                        {/* <td>{ticket.inc_id}</td> */}
                        <td>{ticket.chng_summary}</td>
                        <td>{ticket.created_by}</td>
                        <td>{ticket.statusInfo ? ticket.statusInfo.status_name : 'N/A'}</td>
                    </tr>
                ))}
            </>
        );
    };

   
    const totalIncidentPages = Math.ceil(incidents.length / itemsPerPage);
    const totalRequestPages = Math.ceil(requests.length / itemsPerPage);
    const totalChangePages = Math.ceil(changes.length / itemsPerPage);

   
//if (loadingIncidents || loadingRequests || loadingChanges) return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
//if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;


//Fetch requests
    const handleEditData = (id: number, type: string) => {
        navigate(`/admin-dashboard/edit/${type}?${id}`);
    };
   
    const handleSave = (updatedItem: any) => {
       setEditingItem(null); 
    };
    
    const handleCancel = () => {
        setEditingItem(null); 
    };
    const handleIdClick = (workid: number, type: string) => {
       
        navigate(`/admin-dashboard/tickets/workhistory/${type}/${workid}`);
    };

    const handleIncCreateForm = () => {
        navigate(`/admin-dashboard/newincident/`);
    }
    const handleReqCreateForm = () => {
        navigate(`/admin-dashboard/newrequest/`);
    }
    const handleChngCreateForm = () => {
        navigate(`/admin-dashboard/newchangerequest/`);
    }

    return (
    <div className='container mt-4'>

    <h3>Incidents
        <a className="create-link" href="#"  onClick={(e) => { e.preventDefault(); handleIncCreateForm()}}>Create</a></h3>
    <div className='table-responsive'>
        <table className='table table-hover'>
            <thead>
            <tr>
                <th>ID</th>
                <th>Summary</th>
                <th>Created By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {increnderTickets(incpaginatedData(incidents), 'incidents')}
                
            </tbody>
        </table>
        <div className="pagination" style={{ textAlign: 'right', marginTop: '20px' }}>
                {Array.from({ length: totalIncidentPages  }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleIncPageChange(index + 1)}
                        className={inccurrentPage === index + 1 ? 'active' : ''}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            backgroundColor: inccurrentPage === index + 1 ? '#007bff' : '#fff',
                            color: inccurrentPage === index + 1 ? '#fff' : '#000',
                            border: '1px solid #ddd',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
    </div>

    <h3>Requests<a className="create-link" href="#"  onClick={(e) => { e.preventDefault(); handleReqCreateForm()}}>Create</a></h3>
    <div className='table-responsive'>
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Summary</th>
                    <th>Created By</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                
                {reqrenderTickets(reqpaginatedData(requests), 'requests')}
            </tbody>
            </table>
            <div className="pagination" style={{ textAlign: 'right', marginTop: '20px' }}>
                {Array.from({ length: totalRequestPages  }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleReqPageChange(index + 1)}
                        className={reqcurrentPage === index + 1 ? 'active' : ''}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            backgroundColor: reqcurrentPage === index + 1 ? '#007bff' : '#fff',
                            color: reqcurrentPage === index + 1 ? '#fff' : '#000',
                            border: '1px solid #ddd',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
    </div>

    <h3>Change Requests<a className="create-link" href="#"  onClick={(e) => { e.preventDefault(); handleChngCreateForm()}}>Create</a></h3>
    <div className='table-responsive'>   
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Summary</th>
                    <th>Created By</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            {chngrenderTickets(chngpaginatedData(changes), 'changes')}
                
            </tbody>
        </table>
        <div className="pagination" style={{ textAlign: 'right', marginTop: '20px' }}>
                {Array.from({ length: totalChangePages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleChngPageChange(index + 1)}
                        className={chngcurrentPage === index + 1 ? 'active' : ''}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            backgroundColor: chngcurrentPage === index + 1 ? '#007bff' : '#fff',
                            color: chngcurrentPage === index + 1 ? '#fff' : '#000',
                            border: '1px solid #ddd',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        
    </div>

    </div>

    
     );

};

export default TicketList;
