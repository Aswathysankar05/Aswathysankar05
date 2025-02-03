import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserStyle.css'; // Optional: Add CSS for styling
import { BASE_URL } from '../AuthService/Config'
import { sendLogToBackend } from '../utils/logger';

interface Status {
    status_id: number; // Adjust type based on your actual database definition
    status_name: string; // Assuming this is the property name
}


    const UserEditItem: React.FC = () => {
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const authToken = sessionStorage.getItem('authToken');
    const { id, type = 'defaultType' } = useParams();
    const [item, setItem] = useState<any | null>(null); // State for the item
    const [formData, setFormData] = useState<any>({});
    const [statuses, setStatuses] = useState<Status[]>([]);
    const navigate = useNavigate(); // Navigate function for redirecting after save

  useEffect(() => {
   
    const fetchData = async () => {
        try {
            // if (!Loginvalue) {
            //     navigate('/logins', { replace: true });
            // }
            if (!authToken) {
                navigate('/logins', { replace: true });  
            } else {
                console.log('User is authenticated. Token:', authToken);
            }
            // Fetch the item details based on the ID and type
            const itemResponse = await fetch(`${BASE_URL}/${type}/${id}`);
            if (!itemResponse.ok) throw new Error('Network response was not ok');
            const itemData = await itemResponse.json();
            setItem(itemData);
            setFormData(itemData); 
            
            // Fetch the statuses
            const statusResponse = await fetch(`${BASE_URL}/statusInfoes`);
            if (!statusResponse.ok) throw new Error('Network response was not ok');
            const statusData = await statusResponse.json();
            setStatuses(statusData); 
        } catch (error) {
            console.error('Fetch error:', error);
            sendLogToBackend('Fetch error: ' + error, 'error');
        }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

    const handleBack = () => {
        navigate(-1);
    };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your save logic here (e.g., PUT request)
    fetch(`${BASE_URL}/${type}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => {
            navigate('/user-dashboard'); 
        })
        .catch((error) => console.error('Error updating item:', error));
};

if (!item) return <p>Loading...</p>;

return (
    <div className="edit-item-container">
<h3>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</h3>

{type === "incidents" && (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inc_id">ID:</label>
                    <input
                        type="text"
                        id={`inc_id`}
                        name="inc_id"
                        value={formData.inc_id}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`inc_summary`}>Summary:</label>
                    <input
                        type="text"
                        id={`inc_summary`}
                        name={`inc_summary`}
                        value={formData[`inc_summary`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor={`inc_description`}>Description:</label>
                    <textarea
                        id={`inc_description`}
                        name={`inc_description`}
                        value={formData[`inc_description`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`created_by`}>Created By:</label>
                    <input
                        type="text"
                        id={`created_by`}
                        name={`created_by`}
                        value={formData[`created_by`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`created_at`}>Created At:</label>
                    <input
                        type="text"
                        id={`created_at`}
                        name={`created_at`}
                        value={formData[`created_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`updated_at`}>Updated At:</label>
                    <input
                        type="text"
                        id={`updated_at`}
                        name={`updated_at`}
                        value={formData[`updated_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`closed_at`}>Closed At:</label>
                    <input
                        type="text"
                        id={`closed_at`}
                        name={`closed_at`}
                        value={formData[`closed_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`assignmentgroup`}>Assignment Group:</label>
                    <input
                        type="text"
                        id={`assignmentgroup`}
                        name={`assignmentgroup`}
                        value={formData[`assignmentgroup`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`status_id`}>Status:</label>
                    <select
                    id={`status_id`}
                    name={`status_id`}
                    value={formData.statusInfo.status_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select a status</option>
                    {statuses.map((status) => (
                        <option key={status.status_id} value={status.status_id}>
                            {status.status_name} 
                        </option>
                    ))}
                </select>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
            </form>
        )}


    
{type === "requests" && (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="req_id">ID:</label>
                    <input
                        type="text"
                        id={`req_id`}
                        name="req_id"
                        value={formData.req_id}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`req_summary`}>Summary:</label>
                    <input
                        type="text"
                        id={`req_summary`}
                        name={`req_summary`}
                        value={formData[`req_summary`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor={`req_description`}>Description:</label>
                    <textarea
                        id={`req_description`}
                        name={`req_description`}
                        value={formData[`req_description`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`created_by`}>Created By:</label>
                    <input
                        type="text"
                        id={`created_by`}
                        name={`created_by`}
                        value={formData[`created_by`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`created_at`}>Created At:</label>
                    <input
                        type="text"
                        id={`created_at`}
                        name={`created_at`}
                        value={formData[`created_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`updated_at`}>Updated At:</label>
                    <input
                        type="text"
                        id={`updated_at`}
                        name={`updated_at`}
                        value={formData[`updated_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`closed_at`}>Closed At:</label>
                    <input
                        type="text"
                        id={`closed_at`}
                        name={`closed_at`}
                        value={formData[`closed_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`assignmentgroup`}>Assignment Group:</label>
                    <input
                        type="text"
                        id={`assignmentgroup`}
                        name={`assignmentgroup`}
                        value={formData[`assignmentgroup`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`status_id`}>Status:</label>
                    <select
                    id={`status_id`}
                    name={`status_id`}
                    value={formData.statusInfo.status_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select a status</option>
                    {statuses.map((status) => (
                        <option key={status.status_id} value={status.status_id}>
                            {status.status_name} 
                        </option>
                    ))}
                </select>
                    <select
                        id={`status`}
                        name={`status`}
                        value={formData[`status`]}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="Close">Close</option>
                        <option value="In-hold">In-hold</option>
                    </select>
                    
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
            </form>
        )}
               
{type === "changes" && (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="chng_id">ID:</label>
                    <input
                        type="text"
                        id={`chng_id`}
                        name="chng_id"
                        value={formData.chng_id}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`chng_summary`}>Summary:</label>
                    <input
                        type="text"
                        id={`chng_summary`}
                        name={`chng_summary`}
                        value={formData[`chng_summary`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor={`chng_description`}>Description:</label>
                    <textarea
                        id={`chng_description`}
                        name={`chng_description`}
                        value={formData[`chng_description`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`created_by`}>Created By:</label>
                    <input
                        type="text"
                        id={`created_by`}
                        name={`created_by`}
                        value={formData[`created_by`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`created_at`}>Created At:</label>
                    <input
                        type="text"
                        id={`created_at`}
                        name={`created_at`}
                        value={formData[`created_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`updated_at`}>Updated At:</label>
                    <input
                        type="text"
                        id={`updated_at`}
                        name={`updated_at`}
                        value={formData[`updated_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`closed_at`}>Closed At:</label>
                    <input
                        type="text"
                        id={`closed_at`}
                        name={`closed_at`}
                        value={formData[`closed_at`]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={`assignmentgroup`}>Assignment Group:</label>
                    <input
                        type="text"
                        id={`assignmentgroup`}
                        name={`assignmentgroup`}
                        value={formData[`assignmentgroup`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`status_id`}>Status:</label>
                    <select
                    id={`status_id`}
                    name={`status_id`}
                    value={formData.statusInfo.status_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select a status</option>
                    {statuses.map((status) => (
                        <option key={status.status_id} value={status.status_id}>
                            {status.status_name} 
                        </option>
                    ))}
                </select>
                </div>
               
                <button type="button" className="save-data-button" onClick={handleBack}>Back</button>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
            </form>
        )}
            
       

    </div>
  );
  };
export default UserEditItem;
