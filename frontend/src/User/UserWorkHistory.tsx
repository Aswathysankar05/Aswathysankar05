
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Admin/AdminStyle.css'
import { BASE_URL } from '../AuthService/Config'
import { useAuth } from '../AuthService/AuthContext';
import { sendLogToBackend } from '../utils/logger';

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

const ViewWorkHistory: React.FC = () => {
	
	const { isLoggedIn, logout } = useAuth();
	const { workid, type = 'defaultType' } = useParams();
	const [items, setItems] = useState<WorkHistory[]>([]);
	const [statuses, setStatuses] = useState<Status[]>([]);
	const [logins, setLogins] = useState<Login[]>([]);
	const [types, setTypes] = useState<any | null>(null); 
	const [formData, setFormData] = useState<any>({});
	const navigate = useNavigate(); 
	const [activeComponent, setActiveComponent] = useState<string>('viewworkhistory');
	const [comment, setComment] = useState<string>('');
	const [currentStatusName, setCurrentStatusName] = useState<string | null>(null);
	const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
	const [isSaving, setIsSaving] = useState(false);
	const authToken = sessionStorage.getItem('authToken');

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
        //Fetch the item details based on the ID and type
        const itemResponse = await fetch(`${BASE_URL}/workhistory/${workid}`);
        if (!itemResponse.ok) throw new Error('Network response was not ok');
        const itemData = await itemResponse.json();
        if (Array.isArray(itemData)) {
          setItems(itemData);
        } else {
          console.error('Expected an array but received:', itemData);
		  sendLogToBackend('Expected an array but received: ' + itemData, 'error');
        }
            
        // Fetch the item details based on the ID and type
        const typeResponse = await fetch(`${BASE_URL}/${type}/${workid}`);
        if (!typeResponse.ok) throw new Error('Network response was not ok');
        const typeData = await typeResponse.json();
        setTypes(typeData);
        //setFormData(typeData); 
		setFormData({
			...typeData,
			closed_at: typeData.closed_at ? formatDate(typeData.closed_at) : '',
			updated_at: typeData.updated_at ? formatDate(typeData.updated_at) : ''
			
		  });

        // Fetch the statuses
        const statusResponse = await fetch(`${BASE_URL}/statusInfoes`);
        if (!statusResponse.ok) throw new Error('Network response was not ok');
        const statusData = await statusResponse.json();
        setStatuses(statusData); 

		// Set the current status name based on the fetched type data
        if (typeData.statusInfo.status_id) {
          const statusnameResponse = await fetch(`${BASE_URL}/statusInfoes/${typeData.statusInfo.status_id}`);
          if (statusnameResponse.ok) {
            const statusdata = await statusnameResponse.json();
          	setCurrentStatusName(statusdata.status_name);
        } else {
            console.error('Failed to fetch status name');
			sendLogToBackend('Failed to fetch status name', 'error');
        }
        }

        // Fetch the logins
        const loginResponse = await fetch(`${BASE_URL}/supportusers`);
        if (!loginResponse.ok) throw new Error('Network response was not ok');
        const loginData = await loginResponse.json();
        setLogins(loginData); // Set the fetched statuses
      } catch (error) {
        console.error('Fetch error:', error);
		sendLogToBackend('Error fetching data: ' + error, 'error');
			}
    };
    fetchData();
	}, [workid, type]);

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
	const formatDate = (date: string | Date): string  => {
		const options: Intl.DateTimeFormatOptions = { 
			day: 'numeric', 
			month: 'numeric', 
			year: 'numeric', 
			hour: 'numeric', 
			minute: 'numeric', 
			second: 'numeric', 
			hour12: true 
		  };
		  
		  return new Date(date).toLocaleString('en-IN', options); // Adjust locale as needed
		};

  // Handles the submit form
  	const handleSubmit = async (e: React.FormEvent) => {
	const hasChanges = JSON.stringify(formData) !== JSON.stringify(types);
	
  e.preventDefault();
  if (!hasChanges) return; 
//   if(hasChanges){
// 	alert("handleeeeeeeesubmit chnage"+hasChanges)
	
//   }
  setIsSaving(true);
  const dataToSubmit = {
	...formData,
	closed_at: formData.closed_at ? new Date(formData.closed_at).toISOString() : null,
	updated_at: formData.updated_at ? new Date(formData.updated_at).toISOString() : null
	 // Ensure this is in the correct format for backend
  };

	try {
		
		const response = await fetch(`${BASE_URL}/${type}/${workid}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dataToSubmit),
		});
		if (!response.ok) {
			throw new Error('Failed to update data');
		}

		const currenthistorytem = items[0];
		const currentTimestamp = new Date().toISOString();

		if(type === "incidents"){
		if (!currenthistorytem) {
		//alert("workid:"+formData.inc_id+"\nwork_summary:"+formData.inc_summary+"\nwork_description:"+formData.inc_description+"\naction_performed:"+Loginemail+"Updated at" +currentTimestamp+"\nperformed_by:"+Loginemail+"\ntimestamp:"+currentTimestamp);
		const newWorkHistory = {
			workid: formData.inc_id, 
			work_summary: formData.inc_summary, 
			work_description: formData.inc_description, 
			action_performed: "Updated the data",
			performed_by: Loginemail, 
			timestamp: currentTimestamp, 
		};

		//Send work history data to workhistory endpoint
		const historyResponse = await fetch(`${BASE_URL}/workhistory`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newWorkHistory),
		});
		if (!historyResponse.ok) {
			throw new Error('Failed to insert work history');
		}
				}
		else{
			const newWorkHistory = {
			workid: currenthistorytem.workid,
			work_summary: currenthistorytem.work_summary,
			work_description: formData.inc_description,
			action_performed: "Form data Updated",
			performed_by: Loginemail,
			timestamp: currentTimestamp,
			  };
			  try {
				  const response = await fetch(`${BASE_URL}/workhistory`, {
				  method: 'POST',
				  headers: {
				  'Content-Type': 'application/json',
				  },
				  body: JSON.stringify(newWorkHistory),
				  });
				   if (!response.ok) {
					const errorText = await response.text();  // Read the response body
				  	console.error('Error response from server:', errorText);
				  	throw new Error('Network response was not ok');
				  }
					  window.location.reload();
				  } catch (error) {
				  	console.error('Error updating item:', error);
				  	sendLogToBackend('Error updating item: ' + error, 'error');
				  }
			}

		}

		if(type === "requests"){
			if (!currenthistorytem) {
				// Create new work history entry
				const newWorkHistory = {
					workid: formData.req_id, 
					work_summary: formData.req_summary, 
					work_description: formData.req_description, 
					action_performed: "Updated the data",
					performed_by: Loginemail, 
					timestamp: currentTimestamp, 
				};
		
				//Send work history data to workhistory endpoint
				const historyResponse = await fetch(`${BASE_URL}/workhistory`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newWorkHistory),
				});
				if (!historyResponse.ok) {
					throw new Error('Failed to insert work history');
				}
						}
				else{
					const newWorkHistory = {
					workid: currenthistorytem.workid,
					work_summary: currenthistorytem.work_summary,
					work_description: formData.req_description,
					action_performed: "Form data Updated",
					performed_by: Loginemail,
					timestamp: currentTimestamp,
					  };
					  try {
						  const response = await fetch(`${BASE_URL}/workhistory`, {
						  method: 'POST',
						  headers: {
						  'Content-Type': 'application/json',
						  },
						  body: JSON.stringify(newWorkHistory),
						  });
						   if (!response.ok) {
							const errorText = await response.text();  // Read the response body
							  console.error('Error response from server:', errorText);
							  throw new Error('Network response was not ok');
						  }
							  window.location.reload();
						  } catch (error) {
							  console.error('Error updating item:', error);
							  sendLogToBackend('Error updating item: ' + error, 'error');
						  }
					}

		}

		if(type === "changes"){

			if (!currenthistorytem) {
				// Create new work history entry
				const newWorkHistory = {
					workid: formData.chng_id, 
					work_summary: formData.chng_summary, 
					work_description: formData.chng_description, 
					action_performed: "Updated the data",
					performed_by: Loginemail, 
					timestamp: currentTimestamp, 
				};
		
				//Send work history data to workhistory endpoint
				const historyResponse = await fetch(`${BASE_URL}/workhistory`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newWorkHistory),
				});
				if (!historyResponse.ok) {
					throw new Error('Failed to insert work history');
				}
						}
				else{
					const newWorkHistory = {
					workid: currenthistorytem.workid,
					work_summary: currenthistorytem.work_summary,
					work_description: formData.chng_description,
					action_performed: "Form data Updated",
					performed_by: Loginemail,
					timestamp: currentTimestamp,
					  };
					  try {
						  const response = await fetch(`${BASE_URL}/workhistory`, {
						  method: 'POST',
						  headers: {
						  'Content-Type': 'application/json',
						  },
						  body: JSON.stringify(newWorkHistory),
						  });
						   if (!response.ok) {
							const errorText = await response.text();  // Read the response body
							  console.error('Error response from server:', errorText);
							  throw new Error('Network response was not ok');
						  }
							  window.location.reload();
						  } catch (error) {
							  console.error('Error updating item:', error);
							  sendLogToBackend('Error updating item: ' + error, 'error');
						  }
					}
		}

		window.location.reload();
	} catch (error) {
		console.error('Error updating item:', error);
		sendLogToBackend('Error updating item: ' + error, 'error');
		}
		finally {
			setIsSaving(false);
		  }
	};
 
  // Handles the comment submit form
  	const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTimestamp = new Date().toISOString(); 
    const currentItem = items[0];
    if (!currentItem) {
		
      //for incidents
		if(type === "incidents"){
			const newWorkHistory = {
			  workid: formData.inc_id,
			  work_summary: formData.inc_summary,
			  work_description: comment,
			  action_performed: "Updated", 
			  performed_by: Loginemail,
			  timestamp: null,
				};
	  
	try {
        const response = await fetch(`${BASE_URL}/workhistory`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(newWorkHistory),
      });
      if (!response.ok) throw new Error('Network response was not ok');
        window.location.reload();
        // navigate('/workhistory/${workid}');
		  } catch (error) {
        console.error('Error updating item:', error);
		sendLogToBackend('Error updating item: ' + error, 'error');
		  }

		}

//for requests
		if(type === "requests"){
			const newWorkHistory = {
			  workid: formData.req_id,
			  work_summary: formData.req_summary,
			  work_description: comment,
			  action_performed: "Updated", 
			  performed_by: Loginemail,
			  timestamp: null,
				};
	  	try {
        const response = await fetch(`${BASE_URL}/workhistory`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(newWorkHistory),
      });
      if (!response.ok) throw new Error('Network response was not ok');
        window.location.reload();
        // navigate('/workhistory/${workid}');
		  } catch (error) {
        console.error('Error updating item:', error);
		sendLogToBackend('Error updating item: ' + error, 'error');
		  }

		}

		//for chnages
		if(type === "changes"){
			const newWorkHistory = {
			  workid: formData.chng_id,
			  work_summary: formData.chng_summary,
			  work_description: comment,
			  action_performed: "Updated", 
			  performed_by: Loginemail,
			  timestamp: null,
				};
	  
		try {
        const response = await fetch(`${BASE_URL}/workhistory`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(newWorkHistory),
      });
      if (!response.ok) throw new Error('Network response was not ok');
        window.location.reload();
        // navigate('/workhistory/${workid}');
		  } catch (error) {
        console.error('Error updating item:', error);
		sendLogToBackend('Error updating item: ' + error, 'error');
		  }

		}
	}
	  else{
      const newWorkHistory = {
      workid: currentItem.workid,
      work_summary: currentItem.work_summary,
      work_description: comment,
      action_performed: "Updated", // or whatever you prefer
      performed_by: Loginemail,
      timestamp: null,
		};
		try {
			const response = await fetch(`${BASE_URL}/workhistory`, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(newWorkHistory),
			});
			if (!response.ok) throw new Error('Network response was not ok');
				window.location.reload();
			} catch (error) {
			console.error('Error updating item:', error);
			sendLogToBackend('Error updating item: ' + error, 'error');
			}
	  }
        
	};

	//cancel button
	const handleCancel = () => {
	  const hasChanges = JSON.stringify(formData) !== JSON.stringify(types);
	  if (!hasChanges) return; 
	  setFormData(types); 
	  window.location.reload(); 
	};
	//cancel back
	const handleBack = () => {
		navigate(-1);
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

    const handleLogout = () => {
        logout();
        sessionStorage.clear();
        navigate('/logins', { replace: true });
    };
	const handleNewTicket = () => {
		navigate(`/user-dashboard/viewtickets/createticket/${type}`);
    };

	if (formData.length === 0) return <p>Loading...</p>;
 
	return (
	<div className="work-history-container">
		<nav className="navbar-header">
			<div className="navbar-content">
			{type === "incidents" ? (
       		<span className="incident-number">Incident - INC{formData.inc_id}</span>
   			) : null}
			{type === "requests" ? (
        	<span className="incident-number">Request - REQ{formData.req_id}</span>
    		) : null}
			{type === "changes" ? (
        	<span className="incident-number">Change - CHG{formData.chng_id}</span>
    		) : null}
			<div className="navbar-buttons">
				  <button className="save-button " onClick={handleNewTicket}>New</button>
				  <button className="save-button " onClick={handleRefresh}>Refresh</button>
				  {/* <button className="delete-button">Delete</button> */}
				</div>
			</div>
		</nav>
		
    <div className="edit-item-section">
	{type === "incidents" ? (
		<form onSubmit={handleSubmit} className="edit-form">
		<div className="form-row">
			<div className="form-group">
			<label className="small-text" htmlFor="inc_id">ID:</label>
			<input type="text" className="small-text" id="inc_id" name="inc_id" value={formData.inc_id}  readOnly />
			</div>
			<div className="form-group">
			<label className="small-text" htmlFor="work_summary">Summary:</label>
			<input type="text" className="small-text" id="inc_summary" name="inc_summary" value={formData.inc_summary} readOnly />
			</div>
			<div className="form-group">
			{/* <label className="small-text" htmlFor="inc_priority">Priority:</label>
			<input type="text" className="small-text" id="inc_priority" name="inc_priority" value={formData.inc_priority} required /> */}
			<label className="small-text" htmlFor="inc_priority">Priority Level:</label>
				<select
					id="inc_priority"
					name="inc_priority"
					className="small-text"
					value={formData.inc_priority || ''}
					onChange={handleChange}
					required
				>
					<option value="" disabled>Select priority level</option>
					<option key="P1" value="P1">P1</option>
					<option key="P2" value="P2">P2</option>
					<option key="P3" value="P3">P3</option>
				</select>

			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="inc_description">Description:</label>
			  <textarea id="inc_description" className="small-text" name="inc_description" value={formData.inc_description}  required />
			</div>
		</div>
		<div className="form-row">
		<div className="form-group">
			  <label className="small-text" htmlFor="contact_name">Contact Name:</label>
			  <input type="text" id="contact_name" className="small-text" name="contact_name" value={formData.contact_name} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="contact_email">Contact Email:</label>
			  <input type="text" id="contact_email" className="small-text" name="contact_email" value={formData.contact_email} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_by">Created By:</label>
			  <input type="text" id="created_by" className="small-text" name="created_by" value={formData.created_by} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_at">Created At:</label>
			  <input type="text" id="created_at" className="small-text" name="created_at" value={formData.created_at} readOnly />
			</div>
			
		</div>
		<div className="form-row">
		<div className="form-group">
			  <label className="small-text" htmlFor="updated_at">Updated At:</label>
			  <input type="text" id="updated_at" className="small-text" name="updated_at" value={formData.updated_at}  readOnly />
			</div>
		<div className="form-group">
			<label className="small-text" htmlFor="closed_at">Closed At:</label>
			<input type="text" id="closed_at" className="small-text" name="closed_at" value={formData.closed_at} readOnly />
		</div>
		<div className="form-group">
			<label className="small-text" htmlFor="status_id">Status:</label>
			<select id="status_id" name="status_id" className="small-text" value={formData.statusInfo?.status_id || ''} onChange={handleChange} required>
				<option value="" disabled>Select a status</option>
				{statuses.map((status) => (
				<option key={status.status_id} value={status.status_id}>
				{status.status_name}
				</option>
    		))}
			</select>
		</div>
		<div className="form-group">
		<label className="small-text" htmlFor="assignmentgroup">Assigned to:</label>
		<select id="assignmentgroup" name="assignmentgroup" className="small-text"  value={formData.assignmentgroup || ''} onChange={handleChange} required>
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
			<button type="button" className="save-data-button" onClick={handleBack}>Back</button>
			<button type="submit" className="save-data-button"disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
			{/*{isSaving && (
    			<div className="saving-overlay">
       			 <p>Saving your changes, please wait...</p>
    			</div>
			)}*/}

			<button type="button" className="save-data-button" onClick={handleCancel}>Cancel</button>
			</div>
	   </form>
	   ) : null}
    
	{type === "requests" ? (
		<form onSubmit={handleSubmit} className="edit-form">
		<div className="form-row">
			<div className="form-group">
			<label className="small-text" htmlFor="req_id">ID:</label>
			<input type="text" className="small-text" id="req_id" name="req_id" value={formData.req_id}  readOnly />
			</div>
			<div className="form-group">
			<label className="small-text" htmlFor="req_summary">Summary:</label>
			<input type="text" className="small-text" id="req_summary" name="req_summary" value={formData.req_summary} readOnly />
			</div>
			<div className="form-group">
			{/* <label className="small-text" htmlFor="req_priority">Priority:</label>
			<input type="text" className="small-text" id="req_priority" name="req_priority" value={formData.req_priority} onChange={handleChange} required /> */}
			<label className="small-text" htmlFor="req_priority">Priority Level:</label>
				<select
					id="req_priority"
					name="req_priority"
					className="small-text"
					value={formData.req_priority || ''}
					onChange={handleChange}
					required
				>
					<option value="" disabled>Select priority level</option>
					<option key="P1" value="P1">P1</option>
					<option key="P2" value="P2">P2</option>
					<option key="P3" value="P3">P3</option>
				</select>
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="req_description">Description:</label>
			  <textarea id="req_description" className="small-text" name="req_description" value={formData.req_description}  required />
			</div>
		</div>
		
		<div className="form-row">
		<div className="form-group">
			  <label className="small-text" htmlFor="contact_name">Contact Name:</label>
			  <input type="text" id="contact_name" className="small-text" name="contact_name" value={formData.contact_name} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="contact_email">Contact Email:</label>
			  <input type="text" id="contact_email" className="small-text" name="contact_email" value={formData.contact_email} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_by">Created By:</label>
			  <input type="text" id="created_by" className="small-text" name="created_by" value={formData.created_by} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_at">Created At:</label>
			  <input type="text" id="created_at" className="small-text" name="created_at" value={formData.created_at} readOnly />
			</div>
			
		</div>
		<div className="form-row">
		<div className="form-group">
			  <label className="small-text" htmlFor="updated_at">Updated At:</label>
			  <input type="text" id="updated_at" className="small-text" name="updated_at" value={formData.updated_at}  readOnly />
			</div>
		<div className="form-group">
			<label className="small-text" htmlFor="closed_at">Closed At:</label>
			<input type="text" id="closed_at" className="small-text" name="closed_at" value={formData.closed_at} onChange={handleChange} readOnly />
		</div>
		<div className="form-group">
			<label className="small-text" htmlFor="status_id">Status:</label>
			<select id="status_id" name="status_id" className="small-text" value={formData.statusInfo?.status_id || ''} onChange={handleChange} required>
				<option value="" disabled>Select a status</option>
				{statuses.map((status) => (
				<option key={status.status_id} value={status.status_id}>
				{status.status_name}
				</option>
    		))}
			</select>
		</div>
		<div className="form-group">
		<label className="small-text" htmlFor="assignmentgroup">Assigned to:</label>
		<select id="assignmentgroup" name="assignmentgroup" className="small-text"  value={formData.assignmentgroup || ''} onChange={handleChange} required>
			<option value="" disabled>Select a User to Assign</option>
			{logins.map((login) => (
				<option key={login.email} value={login.email}>
				{login.email}
				</option>
			))}
			</select>
		</div>
		</div>
			<div className="form-footer">
			<button type="button" className="save-data-button" onClick={handleBack}>Back</button>
			<button type="submit" className="save-data-button"disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
			<button type="button" className="save-data-button" onClick={handleCancel}>Cancel</button>
			</div>
	   </form>
	) : null}
	
	{type === "changes" ? (
		<form onSubmit={handleSubmit} className="edit-form">
		<div className="form-row">
			<div className="form-group">
			<label className="small-text" htmlFor="chng_id">ID:</label>
			<input type="text" className="small-text" id="chng_id" name="chng_id" value={formData.chng_id}  readOnly />
			</div>
			<div className="form-group">
			<label className="small-text" htmlFor="chng_summary">Summary:</label>
			<input type="text" className="small-text" id="chng_summary" name="chng_summary" value={formData.chng_summary} readOnly />
			</div>
			<div className="form-group">
			{/* <label className="small-text" htmlFor="chng_priority">Priority:</label>
			<input type="text" className="small-text" id="chng_priority" name="chng_priority" value={formData.chng_priority} onChange={handleChange} required /> */}
			<label className="small-text" htmlFor="chng_priority">Priority Level:</label>
				<select
					id="chng_priority"
					name="chng_priority"
					className="small-text"
					value={formData.chng_priority || ''}
					onChange={handleChange}
					required
				>
					<option value="" disabled>Select priority level</option>
					<option key="P1" value="P1">P1</option>
					<option key="P2" value="P2">P2</option>
					<option key="P3" value="P3">P3</option>
				</select>
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="chng_description">Description:</label>
			  <textarea id="chng_description" className="small-text" name="chng_description" value={formData.chng_description}  required />
			</div>
		</div>
		<div className="form-row">
				<div className="form-group">
			  <label className="small-text" htmlFor="contact_name">Contact Name:</label>
			  <input type="text" id="contact_name" className="small-text" name="contact_name" value={formData.contact_name} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="contact_email">Contact Email:</label>
			  <input type="text" id="contact_email" className="small-text" name="contact_email" value={formData.contact_email} onChange={handleChange} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_by">Created By:</label>
			  <input type="text" id="created_by" className="small-text" name="created_by" value={formData.created_by} readOnly />
			</div>
			<div className="form-group">
			  <label className="small-text" htmlFor="created_at">Created At:</label>
			  <input type="text" id="created_at" className="small-text" name="created_at" value={formData.created_at} readOnly />
			</div>
			
		</div>
		<div className="form-row">
		<div className="form-group">
			  <label className="small-text" htmlFor="updated_at">Updated At:</label>
			  <input type="text" id="updated_at" className="small-text" name="updated_at" value={formData.updated_at}  readOnly />
			</div>
		<div className="form-group">
			<label className="small-text" htmlFor="closed_at">Closed At:</label>
			<input type="text" id="closed_at" className="small-text" name="closed_at" value={formData.closed_at} onChange={handleChange} readOnly />
		</div>
		<div className="form-group">
			<label className="small-text" htmlFor="status_id">Status:</label>
			<select id="status_id" name="status_id" className="small-text" value={formData.statusInfo?.status_id || ''} onChange={handleChange} required>
				<option value="" disabled>Select a status</option>
				{statuses.map((status) => (
				<option key={status.status_id} value={status.status_id}>
				{status.status_name}
				</option>
    		))}
			</select>
		</div>
		<div className="form-group">
		<label className="small-text" htmlFor="assignmentgroup">Assigned to:</label>
		<select id="assignmentgroup" name="assignmentgroup" className="small-text"  value={formData.assignmentgroup || ''} onChange={handleChange} required>
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
			<button type="button" className="save-data-button" onClick={handleBack}>Back</button>
			<button type="submit" className="save-data-button"disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
			<button type="button" className="save-data-button" onClick={handleCancel}>Cancel</button>
			</div>
	   </form>
	) : null}
	</div>
	
	<div className="work-history-section">
		<h5>Notes</h5>
		<ul className="work-history-list">
			{items.map(item => (
			<li key={item.id} className="work-history-item">
			<p className="small-text"><strong>Action:</strong> {item.action_performed || 'No action performed'}</p>
			<p className="small-text"><strong>Description:</strong> {item.work_description || 'No description available'}</p>
			<p className="small-text"><strong>Performed By:</strong> {item.performed_by || 'Unknown'}</p>
			<p className="small-text"><strong>Updated at:</strong> {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</p>
			</li>
			))}
		</ul>

    <form className="comment-form" onSubmit={handleCommentSubmit}>
		<textarea
		  id="comment"
		  value={comment}
		  onChange={(e) => setComment(e.target.value)}
		  placeholder="Enter your comment..."
		  rows={4}
		  className="comment-textarea"
		/>
		{/* <button type="submit" className="submit-comment-button ">Submit Comment</button> */}
		<button type="submit" className="submit-comment-button" disabled={!comment.trim()} >Submit Comment</button>
    </form>
	</div>
	</div>
 
	);
	};

export default ViewWorkHistory;
