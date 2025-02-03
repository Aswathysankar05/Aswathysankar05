
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../AuthService/Config';
import './Request.css';
import { sendLogToBackend } from '../../../utils/logger';

export const NewRequest = () => {
  
    const [req_priority, setRequestPriorityLevel] = useState('');
    const [contact_name, setRequestContactname] = useState('');
    const [contact_email, setRequestContactemail] = useState('');
    const [created_by, setRequestCreatedBy] = useState('');
    const [req_summary, setRequestName] = useState('');
    const [req_description, setRequestDescription] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');
    const Loginemail = sessionStorage.getItem('loginemail');
    const navigate = useNavigate();
    
//cancel button
    const handleCancel = () => {
     
        setRequestName('');
        setRequestDescription('');
        setRequestPriorityLevel('');
        setRequestContactname('');
        setRequestContactemail('');
        window.location.reload(); 
    };
   // Handles the submit form
   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        // Basic validation
        if (!req_summary || !req_description || !req_priority || !contact_name || !contact_email) {
            setErrorMessage('Please fill out all fields.');
            alert("Please fill out all fields.")
            return; // Stop form submission
        }
        const requestData = {
            req_summary,
            req_description,
            req_priority,
            contact_name,
            contact_email,
            created_by: Loginemail,
        };
    try {
      const response = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestData),
      });



      if (!response.ok) {
          throw new Error('Failed to update data');
        }
        navigate('/admin-dashboard/tickets');
      //window.location.reload();
      //alert('Data updated successfully!');
  
      } catch (error) {
        console.error('Error updating item:', error);
        sendLogToBackend('Error updating item: ' + error, 'error');
      }
    };
    return (
<div className='container'>
<br/><br/>
    <div className='row justify-content-center'>
        <div className="card col-md-7">
            <h2 className='text-center'> Create New Request</h2>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Summary</label>
                        <input 
                        type='text' 
                        placeholder='Short, descriptive title of the request' 
                        name='req_summary' 
                        value= {req_summary}
                        className='form-control'
                        onChange={(e) => setRequestName(e.target.value)}
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
                        name='req_description' 
                        value={req_description}
                        onChange={(e) => setRequestDescription(e.target.value)}
                        required
                       />

                    </div>

                    <div className='form-group mb-2'>
                        <label className='form-label'>Priority Level</label>
                        <select 
                            name='req_priority' 
                            value={req_priority} 
                            className='form-control' 
                            onChange={(e) => setRequestPriorityLevel(e.target.value)}
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
                        onChange={(e) => setRequestContactname(e.target.value)}
                        required
                        style={{ marginBottom: '10px' }} >
                        </input>
                       
                        <input 
                        type='email' 
                        placeholder='Email' 
                        name='contact_email' 
                        value= {contact_email}
                        className='form-control'
                        onChange={(e) => setRequestContactemail(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                    
                    <button className='req-cancel-button' type='submit'>Submit</button>
                    <button className='req-cancel-button' type='button' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
</div>
    
 

    );
}