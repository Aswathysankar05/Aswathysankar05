
import { useEffect, useState } from 'react';
import './Request.css';
import { BASE_URL } from '../../../AuthService/Config';
import { sendLogToBackend } from '../../../utils/logger';

interface Request {
    req_id: number;
    req_summary: string;
    req_description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    status: string;
    // other fields
}

const RequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${BASE_URL}/requests`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
                setRequests(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                sendLogToBackend('Fetch error: ' + err, 'error');
                setError(err.message);
                setLoading(false);
            });
  

    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='req-container'>
            <h1 className='req-header'>Requests</h1>
            <ul className='requestList'>
                {requests.map(request => (
                   <li key={request.req_id} className='requestItem'>
                   <h2 className='requestName'>{request.req_summary}</h2>
                   <p className='requestDescription'>{request.req_description}</p>
                   <p className='requestMeta'>Created By: {request.created_by}</p>
                   <p className='requestMeta'>Status: {request.status}</p>
                   {/* Render other incident fields here */}
               </li>
                ))}
            </ul>
        </div>
    );


};

export default RequestsPage;
