
import axios from 'axios';
import { useState,useEffect } from 'react';
import { BASE_URL } from '../../../AuthService/Config';
import { useNavigate } from 'react-router-dom';
import './Incident.css';
import { sendLogToBackend } from '../../../utils/logger';

interface Login {
	user_id: number; 
	email: string; 
}
export const NewIncident = () => {
    const [inc_priority, setIncidentPriorityLevel] = useState('');
    const [contact_name, setIncidentContactname] = useState('');
    const [contact_email, setIncidentContactemail] = useState('');
    const [created_by, setIncidentCreatedBy] = useState('');
    const [inc_summary, setIncidentName] = useState('');
    const [inc_description, setIncidentDescription] = useState('');
    const [assignmentgroup, setAssignmentgroup] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');
    const Loginemail = sessionStorage.getItem('loginemail');
    const [suportlogins, setSupportLogins] = useState<Login[]>([]);
    const [logins, setLogins] = useState<Login[]>([]);
    const [incidentcontactNameError, setIncidentContactNameError] = useState<string>('');
    const navigate = useNavigate();

	useEffect(() => {
        const fetchData = async () => {
        try {
            // Fetch the supportlogins
            const supportloginResponse = await fetch(`${BASE_URL}/supportusers`);
            if (!supportloginResponse.ok) throw new Error('Network response was not ok');
            const supportloginData = await supportloginResponse.json();
            setSupportLogins(supportloginData); // Set the fetched statuses

            // Fetch the supportlogins
            const loginResponse = await fetch(`${BASE_URL}/loginusers`);
            if (!loginResponse.ok) throw new Error('Network response was not ok');
            const loginData = await loginResponse.json();
            setLogins(loginData); // Set the fetched statuses
            }
            catch (error) {
              console.error('Fetch error:', error);
          sendLogToBackend('Error fetching data: ' + error, 'error');
            }
        };
        fetchData();

    },);
//cancel button
    const handleCancel = () => {
        setIncidentName('');
        setIncidentDescription('');
        setIncidentPriorityLevel('');
        setIncidentContactname('');
        setIncidentContactemail('');
        window.location.reload(); 
    };
   // Handles the submit form
   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        // Basic validation
        if (!inc_summary || !inc_description || !inc_priority || !contact_name || !contact_email) {
            setErrorMessage('Please fill out all fields.');
            alert("Please fill out all fields.")
            return; 
        }
        const incidentData = {
            inc_summary,
            inc_description,
            inc_priority,
            contact_name,
            contact_email,
            created_by: Loginemail,
        };
    try {
      const response = await fetch(`${BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
        },
        body: JSON.stringify(incidentData),
      });

    if (!response.ok) {
          throw new Error('Failed to update data');
        }
      navigate('/admin-dashboard/tickets');
      } catch (error) {
        console.error('Error updating item:', error);
        sendLogToBackend('Error updating item: ' + error, 'error');
      }
    };

    const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
     // Regular expression to allow only alphabets and spaces
        const isValid = /^[A-Za-z\s]*$/.test(value); // Matches only alphabetic characters and spaces
    
        if (isValid || value === '') {
            setIncidentContactname(value); // Only set the value if valid
        } else {
            // Optionally show an error message here
            setIncidentContactNameError('Contact Name can only contain alphabetic characters and spaces');
            setErrorMessage('Contact Name can only contain alphabetic characters and spaces');
        }
    };

    return (
<div className='container'>
<br/><br/>
    <div className='row justify-content-center'>
        <div className="card col-md-7">
            <h2 className='text-center'> Create New Incident</h2>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Summary</label>
                        <input 
                        type='text' 
                        placeholder='Short, descriptive title of the incident' 
                        name='inc_summary' 
                        value= {inc_summary}
                        className='form-control'
                        onChange={(e) => setIncidentName(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                     <div className='form-group mb-2'>
                        <label className='form-label'> Description</label>
                        <textarea
                        className='form-control'
                        placeholder='Detailed description of the issue' 
                        rows={4}
                        name='inc_description' 
                        value={inc_description}
                        onChange={(e) => setIncidentDescription(e.target.value)}
                        required
                       />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Priority Level</label>
                        <select 
                            name='inc_priority' 
                            value={inc_priority} 
                            className='form-control' 
                            onChange={(e) => setIncidentPriorityLevel(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select priority level</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                            <option value="P4">P4</option>
                        </select>
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'> Contact Information</label>
                        <input 
                        type='text' 
                        placeholder='Name' 
                        name='contact_name' 
                        value= {contact_name}
                        className='form-control'
                        onChange={handleContactNameChange}
                        //onChange={(e) => setIncidentContactname(e.target.value)}
                        required
                        style={{ marginBottom: '10px' }} >
                        </input>
                        {incidentcontactNameError && <span className="incidenterror-message">{incidentcontactNameError}</span>}
                        {/* <input 
                        type='email' 
                        placeholder='Email' 
                        name='contact_email' 
                        value= {contact_email}
                        className='form-control'
                        onChange={(e) => setIncidentContactemail(e.target.value)}
                        required
                        >
                        </input> */}
                      
                        {/* <label className='form-label'> Email</label> */}
                        
                        <select 
                        name="contact_email" 
                        value={contact_email} 
                        className="form-control"  
                        onChange={(e) => setIncidentContactemail(e.target.value)}
                        required>
                            <option value="" disabled>Email</option>
                            {logins.map((login) => (
                            <option key={login.email} value={login.email}>
                            {login.email}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Assigned to:</label>
                        <select 
                        name="assignmentgroup" 
                        value={assignmentgroup} 
                        className="form-control"  
                        onChange={(e) => setAssignmentgroup(e.target.value)}
                        required>
                            <option value="" disabled>Select a User to Assign </option>
                            {suportlogins.map((suportlogin) => (
                            <option key={suportlogin.email} value={suportlogin.email}>
                            {suportlogin.email}
                            </option>
                            ))}
                        </select>
                    </div><br></br>
                    <button className='inc-cancel-button' type='submit'>Submit</button>
                    <button className='inc-cancel-button' type='button' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
</div>
);
}