
import { useEffect, useState } from 'react';
import './Changes.css';
import { BASE_URL } from '../../../AuthService/Config';
import { sendLogToBackend } from '../../../utils/logger';

interface Change {
    chng_id: number;
    chng_summary: string;
    chng_description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    status: string;
    // other fields
}

const ChangesPage: React.FC = () => {
    const [changes, setChanges] = useState<Change[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${BASE_URL}/changes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
                setChanges(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                sendLogToBackend('Error fetching data: ' + err, 'error');
                setLoading(false);
            });
  

    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='chng-container'>
            <h1 className='chng-header'>Change Requests</h1>
            <ul className='changeList'>
                {changes.map(change => (
                   <li key={change.chng_id} className='changeItem'>
                   <h2 className='changeName'>{change.chng_summary}</h2>
                   <p className='changeDescription'>{change.chng_description}</p>
                   <p className='changeMeta'>Created By: {change.created_by}</p>
                   <p className='changeMeta'>Status: {change.status}</p>
                   
               </li>
                ))}
            </ul>
        </div>
    );


};

export default ChangesPage;
