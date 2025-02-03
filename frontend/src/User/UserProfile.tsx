import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserStyle.css'; // Optional: Add CSS for styling
import { BASE_URL } from '../AuthService/Config'
import { sendLogToBackend } from '../utils/logger';

interface Status {
    status_id: number; // Adjust type based on your actual database definition
    status_name: string; // Assuming this is the property name
}


const EditUser: React.FC = () => {
    const { id, usertype = 'defaultType' } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        user_Id: Number(id),
        email: '',
        user_Type: '',
        pswd: '',
        pswdCnfrm: '',
    });
    const [error, setError] = useState<string | null>(null);
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
    // Fetch user data by ID
    fetch(`${BASE_URL}/users/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUser(data);
        })
        .catch(err => {
            console.error('Fetch error:', err);
            sendLogToBackend('Error fetching data: ' + err, 'error');
            setError(err.message);
        });
}, [id]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your save logic here (e.g., PUT request)
    fetch(`${BASE_URL}i/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => {
           navigate('/user-dashboard/users'); 
        })
        .catch((error) => console.error('Error updating item:', error));
};


return (
    <div className="edit-item-container">
          <h5> Thanks for visiting! This page isn’t quite ready yet, but we’re busy making it happen. Look for updates in our upcoming sprint. We appreciate your understanding!</h5>
{/* <h3>Edit {usertype.charAt(0).toUpperCase() + usertype.slice(1)}</h3> */}
{/* 

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id={`email`}
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`inc_summary`}>Type of User:</label>
                    <input
                        type="text"
                        id={`user_Type`}
                        name={`user_Type`}
                        value={user[`user_Type`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                
               
                <div className="form-group">
                    <label htmlFor={`pswd`}>Password</label>
                    <input
                        type="text"
                        id={`pswd`}
                        name={`pswd`}
                        value={user[`pswd`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
            </form> */}
    </div>
  );
  };
export default EditUser;
