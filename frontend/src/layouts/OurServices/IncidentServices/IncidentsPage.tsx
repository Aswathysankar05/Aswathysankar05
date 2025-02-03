
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Incident.css';
import { BASE_URL } from '../../../AuthService/Config';
import { sendLogToBackend } from '../../../utils/logger';

interface Incident {
    inc_id: number;
    inc_summary: string;
    inc_description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    assignmentgroup: string;
    status: string;
    // other fields
}

const IncidentsPage: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigator = useNavigate();

    useEffect(() => {
        fetch(`${BASE_URL}/incidents`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // setIncidents(data);

                // if (data && data._embedded && Array.isArray(data._embedded.incidents)) {
                //     setIncidents(data._embedded.incidents);
                // } else {
                //     throw new Error('Data is not in expected format');
                // }
                setIncidents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                sendLogToBackend('Error fetching data: ' + err, 'error');
                setError(err.message);
                setLoading(false);
            });



    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    function addNewIncident() {
        navigator('/add-incident')
    }


    return (
        <div className='inc-container'>
            <h1 className='inc-header'>Incidents</h1>
            <button className='btn btn-primary' style={{ borderRadius: '5px', cursor: 'pointer', marginLeft: '80%', marginBottom: "40px" }} onClick={addNewIncident}>Create New Incident</button>
            <ul className='incidentList'>
                {incidents.map(incident => (
                    <li key={incident.inc_id} className='incidentItem'>
                        <h2 className='incidentName'>{incident.inc_summary}</h2>
                        <p className='incidentDescription'>{incident.inc_description}</p>
                        <p className='incidentMeta'>Created By: {incident.created_by}</p>
                        <p className='incidentMeta'>Status: {incident.status}</p>

                    </li>
                ))}
            </ul>
        </div>
    );

};

export default IncidentsPage;
