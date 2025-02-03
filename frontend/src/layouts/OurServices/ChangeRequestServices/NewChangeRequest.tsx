
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../AuthService/Config';
import './Changes.css'
import { sendLogToBackend } from '../../../utils/logger';

export const NewChangeRequest = () => {
  
    const [chng_priority, setChangePriorityLevel] = useState('');
    const [contact_name, setChangeContactname] = useState('');
    const [contact_email, setChangeContactemail] = useState('');
    const [created_by, setChangeCreatedBy] = useState('');
    const [chng_summary, setChangeName] = useState('');
    const [chng_description, setChangeDescription] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');
    const Loginemail = sessionStorage.getItem('loginemail');
    const navigate = useNavigate();
    const [changecontactNameError, setChangeContactNameError] = useState<string>('');
		
//cancel button
    const handleCancel = () => {
     
        setChangeName('');
        setChangeDescription('');
        setChangePriorityLevel('');
        setChangeContactname('');
        setChangeContactemail('');
        window.location.reload(); 
    };
   // Handles the submit form
   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        // Basic validation
        if (!chng_summary || !chng_description || !chng_priority || !contact_name || !contact_email) {
            setErrorMessage('Please fill out all fields.');
            alert("Please fill out all fields.")
            return; // Stop form submission
        }
        const changeData = {
            chng_summary,
            chng_description,
            chng_priority,
            contact_name,
            contact_email,
            created_by: Loginemail,
        };
    try {
      const response = await fetch(`${BASE_URL}/changes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
        },
        body: JSON.stringify(changeData),
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

    const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
     // Regular expression to allow only alphabets and spaces
        const isValid = /^[A-Za-z\s]*$/.test(value); // Matches only alphabetic characters and spaces
    
        if (isValid || value === '') {
            setChangeContactname(value); // Only set the value if valid
        } else {
            // Optionally show an error message here
            setChangeContactNameError('Contact Name can only contain alphabetic characters and spaces');
            setErrorMessage('Contact Name can only contain alphabetic characters and spaces');
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
                        name='chng_summary' 
                        value= {chng_summary}
                        className='form-control'
                        onChange={(e) => setChangeName(e.target.value)}
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
                        name='chng_description' 
                        value={chng_description}
                        onChange={(e) => setChangeDescription(e.target.value)}
                        required
                       />

                    </div>

                    <div className='form-group mb-2'>
                        <label className='form-label'>Priority Level</label>
                        <select 
                            name='chng_priority' 
                            value={chng_priority} 
                            className='form-control' 
                            onChange={(e) => setChangePriorityLevel(e.target.value)}
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
                        onChange={(e) => setChangeContactname(e.target.value)}
                        required
                        style={{ marginBottom: '10px' }} >
                        </input>
                       
                        <input 
                        type='email' 
                        placeholder='Email' 
                        name='contact_email' 
                        value= {contact_email}
                        className='form-control'
                        onChange={(e) => setChangeContactemail(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                    
                    <button className='chng-cancel-button' type='submit'>Submit</button>
                    <button className='chng-cancel-button' type='button' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
</div>
    
 

    );
}