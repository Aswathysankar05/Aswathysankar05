
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

const UserTickets: React.FC = () => {
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
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const authToken = sessionStorage.getItem('authToken');

    useEffect(() => {
        // if (!Loginvalue) {
        //     navigate('/logins', { replace: true });
        // }  
        if (!authToken) {
            navigate('/logins', { replace: true });  
        } else {
            console.log('User is authenticated. Token:', authToken);
        }      
//Fetch incidents
        fetch(`${BASE_URL}/incidents`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
                setIncidents(data);
                setLoadingIncidents(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoadingIncidents(false);
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
                
                setRequests(data);
                setLoadingRequests(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                sendLogToBackend('Fetch error: ' + err, 'error');
                setLoadingRequests(false);
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
                
                setChanges(data);
                setLoadingchanges(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                sendLogToBackend('Fetch error: ' + err, 'error');
                setLoadingchanges(false);
            });

    }, []);

if (loadingIncidents || loadingRequests || loadingChanges) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    //Fetch requests
   const handleEditData = (id: number, type: string) => {

            // alert('itemm typeeeeeeeeee'+type)
        navigate(`/user-dashboard/edit/${type}/${id}`);
       
      };
    
      const handleSave = (updatedItem: any) => {
       setEditingItem(null); 
      };
    
      const handleCancel = () => {
        setEditingItem(null); 
      };
      const handleIdClick = (workid: number) => {
        navigate(`/workhistory/${workid}`);
    };
    //   if (loading) return <p>Loading...</p>;
    //   if (error) return <p>Error: {error}</p>;

    return (
        <div>
      <h2>Incidents</h2>
      <table className='incident-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Summary</th>
            {/* <th>Description</th> */}
            <th>Created By</th>
            <th>Status</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.inc_id}>
              {/* <td  onClick={() => handleIdClick(incident.inc_id)}> */}
              <td>
                <a 
                    href="#" 
                    onClick={(e) => {
                    e.preventDefault(); // Prevent the default link behavior
                    handleIdClick(incident.inc_id);
                    }}
                >
                INC{incident.inc_id}</a></td>
              <td>{incident.inc_summary}</td>
              {/* <td>{incident.inc_description}</td> */}
              <td>{incident.created_by}</td>
              <td>{incident.statusInfo ? incident.statusInfo.status_name : 'N/A'}</td>
              <td>
                {/* <button onClick={() => handleEdit(incident.inc_id)}>Edit</button> */}
                <button onClick={() => handleEditData(incident.inc_id, 'incidents')}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Requests</h3>
            <table className='request-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Summary</th>
                        {/* <th>Description</th> */}
                        <th>Created By</th>
                        <th>Status</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.req_id}>
                            <td>REQ{request.req_id}</td>
                            <td>{request.req_summary}</td>
                            {/* <td>{request.req_description}</td> */}
                            <td>{request.created_by}</td>
                            <td>{request.statusInfo ? request.statusInfo.status_name : 'N/A'}</td>
                          
                            <td>
                            {/* <button onClick={() => handleEdit(request.req_id)}>Edit</button> */}
                            <button onClick={() => handleEditData(request.req_id, 'requests')}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Change Requests</h2>
            <table className='change-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Summary</th>
                        {/* <th>Description</th> */}
                        <th>Created By</th>
                        <th>Status</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {changes.map((change) => (
                        <tr key={change.chng_id}>
                            <td>CHG{change.chng_id}</td>
                            <td>{change.chng_summary}</td>
                            {/* <td>{change.chng_description}</td> */}
                            <td>{change.created_by}</td>
                            <td>{change.statusInfo ? change.statusInfo.status_name : 'N/A'}</td>
                            <td>
                            {/* <button  onClick={() => handleEdit(change.chng_id)}>Edit</button> */}
                            <button  onClick={() => handleEditData(change.chng_id, 'changes')}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>
  );
};


export default UserTickets;
