
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Admin/AdminStyle.css'
import { BASE_URL } from '../AuthService/Config'
import { useAuth } from '../AuthService/AuthContext';
import { sendLogToBackend } from '../utils/logger';

//Define the types for the WorkHistory data
interface WorkHistory {
	id: number;
	workid: number;
	work_summary: string | null;
  action_performed: string | null;
	work_description: string | null;
	performed_by: string | null;
	timestamp: string | null;
}

interface Status {
  status_id: string; 
  status_name: string; 
}
interface Login {
	user_id: number; 
	email: string; 
}

const CreateTicket: React.FC = () => {
	
	const { isLoggedIn, logout } = useAuth();
	const { workid, type = 'defaultType' } = useParams();
	const [items, setItems] = useState<WorkHistory[]>([]);
	const [statuses, setStatuses] = useState<Status[]>([]);
	const [logins, setLogins] = useState<Login[]>([]);
  const authToken = sessionStorage.getItem('authToken');
	const [types, setTypes] = useState<any | null>(null); 
	const [formData, setFormData] = useState<any>({});
	const navigate = useNavigate(); 
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
	const [activeComponent, setActiveComponent] = useState<string>('viewworkhistory');
	// State for user comment input
	const [comment, setComment] = useState<string>('');
	const [currentStatusName, setCurrentStatusName] = useState<string | null>(null);
    const [ticket_priority, setTicketPriorityLevel] = useState('');
    const [ticket_contactname, setTicketContactname] = useState('');
    const [ticket_contactemail, setTicketContactemail] = useState('');
    const [ticket_assignmentgroup, setTicketAssignmentGroup] = useState('');
    const [ticket_createdby, setTicketCreatedBy] = useState('');
    const [ticket_summary, setTicketName] = useState('');
    const [ticket_description, setTicketDescription] = useState('');
    const [ticket_type, setTicketType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [contactNameError, setContactNameError] = useState<string>('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


    const [inc_summary, setIncidentName] = useState('');
	const [inc_description, setIncidentDescription] = useState('');
	const [inc_priority, setIncidentPriorityLevel] = useState('');
	const [contact_name, setIncidentContactname] = useState('');
    const [contact_email, setIncidentContactemail] = useState('');
    const [created_by, setIncidentCreatedBy] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch work history data
	useEffect(() => {
        // if (!Loginvalue) {
        //     navigate('/logins', { replace: true });
        // }
        if (!authToken) {
          navigate('/logins', { replace: true });  
      } else {
          console.log('User is authenticated. Token:', authToken);
      }

        const fetchData = async () => {
          try {
        // Fetch the logins
        const loginResponse = await fetch(`${BASE_URL}/supportusers`);
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
	
		// Check if the input is for status_id
		if (name === 'status_id') {
			setFormData({ 
				...formData, 
				statusInfo: {
					...formData.statusInfo,
					status_id: value // Update only the status_id
				} 
			});
		} else {
			// For other fields
			setFormData({ 
				...formData, 
				[name]: value 
			});
		}
	};
const handleBack = () => {
		navigate(-1);
	};
  // Handles the submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let url = '';
        let data = {};
        setIsSaving(true);

        if (ticket_type) {
            if (ticket_type === 'incidents') {
                //alert("ticket_type"+ticket_type)
                url = `${BASE_URL}/incidents`;
                data = {
                    inc_summary: ticket_summary,
                    inc_description: ticket_description,
                    inc_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };
            } else if (ticket_type === 'requests') {
                //alert("ticket_type"+ticket_type)
                url = `${BASE_URL}/requests`;
                data = {
                    req_summary: ticket_summary,
                    req_description: ticket_description,
                    req_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };

            } else if (ticket_type === 'changes') {
               // alert("ticket_type"+ticket_type)
                url = `${BASE_URL}/changes`;
                data = {
                    chng_summary: ticket_summary,
                    chng_description: ticket_description,
                    chng_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };
            }
        } else if (type) {
            if (type === 'incidents') {
                //alert("type"+type)
                url = `${BASE_URL}/incidents`;
                data = {
                    inc_summary: ticket_summary,
                    inc_description: ticket_description,
                    inc_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };

            } else if (type === 'requests') {
              //  alert("type"+type)
                url = `${BASE_URL}/requests`;
                data = {
                    req_summary: ticket_summary,
                    req_description: ticket_description,
                    req_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };
            } else if (type === 'changes') {
               // alert("type"+type)
                url = `${BASE_URL}/changes`;
                data = {
                    chng_summary: ticket_summary,
                    chng_description: ticket_description,
                    chng_priority: ticket_priority,
                    contact_name: ticket_contactname,
                    contact_email: ticket_contactemail,
                    created_by: Loginemail,
                    assignmentgroup: ticket_assignmentgroup,
                  };
            }
        }
        try {
           // alert("insertionn")
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
      
            if (response.ok) {
              console.log('Ticket created successfully');
              sendLogToBackend('Ticket created successfully: ', 'info');
              navigate('/user-dashboard/viewtickets/alltickets');
             
            } else {
              console.error('Failed to create ticket');
              sendLogToBackend('Failed to create ticket ', 'error');
            }
          } catch (error) {
            console.error('Error:', error);
            sendLogToBackend('Error: ' + error, 'error');
          }
       
    
};
 
  const isFormValid = () => {
    return (
      ticket_summary.trim() !== '' &&
      ticket_description.trim() !== '' &&
      ticket_priority.trim() !== '' &&
      ticket_contactname.trim() !== '' &&
      ticket_assignmentgroup.trim() !== '' &&
      (ticket_type || type) !== ''
    );
  };

	//cancel button
	const handleCancel = () => {
	  setFormData(types); // Reset to original data
	  window.location.reload(); // Refresh the page
	};
	
	const handleUserDashboard = () => {
        setActiveComponent('user-dashboard');
        navigate('/user-dashboard');
    };

    const handleTickets = () => {
		navigate('/user-dashboard/viewtickets/alltickets');
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
	const handleNewTicket = () => {
        window.location.reload();
    };

    const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
   // Regular expression to allow only alphabets and spaces
      const isValid = /^[A-Za-z\s]*$/.test(value); // Matches only alphabetic characters and spaces
  
      if (isValid || value === '') {
          setTicketContactname(value); // Only set the value if valid
      } else {
          // Optionally show an error message here
          setContactNameError('Contact Name can only contain alphabetic characters and spaces');
          setErrorMessage('Contact Name can only contain alphabetic characters and spaces');
      }
  };
  

	if (formData.length === 0) return <p>Loading...</p>;
 
	return (
	<div className="work-history-container">
		<nav className="navbar-header">
			<div className="navbar-content">
                {type === "incidents" ? (
                <span className="incident-number">Incident </span>
                ) : null}
                {type === "requests" ? (
                <span className="incident-number">Request </span>
                ) : null}
                {type === "changes" ? (
                <span className="incident-number">Change </span>
                ) : null}
                {type === "newticket" ? (
                <span className="incident-number"> 
                </span>
                ) : null}
                <div className="navbar-buttons">
                    <button className="save-button " onClick={handleRefresh}>Refresh</button>
                </div>
			</div>
		</nav>
		
    <div className="edit-item-section">
	
		<form onSubmit={handleSubmit} className="edit-form">
		<div className="form-row">

			<div className="form-group">
			<label className="small-text" htmlFor="ticket_summary">Summary:</label>
			<input type="text" placeholder='Short, descriptive title of the issue' 
            className="small-text" id="ticket_summary" name="ticket_summary" value={ticket_summary} 
            onChange={(e) => setTicketName(e.target.value)} required />
			</div>

			<div className="form-group">
			  <label className="small-text" htmlFor="ticket_description">Description:</label>
			  <textarea id="ticket_description" className="small-text" placeholder='Detailed description of the issue' 
              name="ticket_description" value={ticket_description} onChange={(e) => setTicketDescription(e.target.value)} required />
			</div>

            {type === "newticket" ? (
            <div className="form-group">
             <label className="small-text" htmlFor="ticket_type">Ticket Type:</label>
             <select 
                            name='ticket_type' 
                            value={ticket_type} 
                            className='small-text' 
                            onChange={(e) => setTicketType(e.target.value)}
                            required
                        >  <option value="" disabled>Select Ticket Type</option>
                        <option value="incidents">Incident</option>
                        <option value="requests">Request</option>
                        <option value="changes">Change Request</option>
                    
                    </select>
                </div>
                ) : null}
		</div>
		<div className="form-row">
        <div className="form-group">
			  <label className="small-text" htmlFor="ticket_priority">Priority Level:</label>
			 
                        <select 
                            name='ticket_priority' 
                            value={ticket_priority} 
                            className='small-text' 
                            onChange={(e) => setTicketPriorityLevel(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select priority level</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                            <option value="P4">P4</option>
                        </select>
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="ticket_contactname">Contact Name:</label>
			  {/* <input type="text" id="ticket_contactname" placeholder='Name' onChange={(e) => setTicketContactname(e.target.value)} */}
        <input type="text" id="ticket_contactname" placeholder='Name' onChange={handleContactNameChange}
              className="small-text" name="ticket_contactname" value={ticket_contactname}  required />
                {contactNameError && <span className="error-message">{contactNameError}</span>}
			</div>
        <div className="form-group">
			  <label className="small-text" htmlFor="ticket_contactemail">Contact Email:</label>
			  <input type="email" id="ticket_contactemail" placeholder='Email'  className="small-text" 
              name="ticket_contactemail" value={Loginemail || ''}  readOnly /> 
            
			</div>
      <div className="form-group">
			   <label className="small-text" htmlFor="ticket_assignmentgroup">Assigned to:</label>
          <select name="ticket_assignmentgroup" className="small-text"  value={ticket_assignmentgroup || ''} onChange={(e) => setTicketAssignmentGroup(e.target.value)} required>
            <option value="" disabled>Select a User to Assign </option>
            {logins.map((login) => (
              <option key={login.email} value={login.email}>
              {login.email}
              </option>
            ))}
          </select>
			</div>
           
		</div>
		
			<div className="form-footer">
      {/* <button type="submit" className="save-data-button"disabled={isSaving || !isFormValid()}> {isSaving ? 'Saving...' : 'Save'}</button>
			 */}
      {/* <button type="submit" className="save-data-button">Save</button> */}
      <button type="button" className="save-data-button" onClick={handleBack}>Back</button>
      <button type="submit" className="save-data-button"disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
			
			<button type="button" className="save-data-button" onClick={handleCancel}>Cancel</button>
			</div>
	   </form>
	  
   
	</div>

	</div>
 
	);
	};

export default CreateTicket;
