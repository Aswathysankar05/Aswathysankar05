import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminStyle.css'; // Optional: Add CSS for styling
import { BASE_URL } from '../AuthService/Config'
import { sendLogToBackend } from '../utils/logger';

interface User {
    user_id: number;
    fullname: string;
    jobInfo?: JobInfo;
    email: string;
    phonenumber: string;
    pswd: string;
    pswdCnfrm	: string;
    user_Type	: string;
    user_Status	: string;
    
}
interface JobInfo {
    job_id: number; 
    job_title: string; 
}

const EditUser: React.FC = () => {
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const { id, usertype = 'defaultType' } = useParams();
    const authToken = sessionStorage.getItem('authToken');
    const navigate = useNavigate();
    const [user, setUser] = useState({
        user_Id: Number(id),
        fullname: '',
        jobInfo: { job_id: 0, job_title: '' },
        email: '',
        phonenumber: '',
        user_Type: '',
        user_Status:'',
        pswd: '',
        pswdCnfrm: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [user_id, setUser_Id] = useState('');
    const [fullname, setFullname] = useState('');
    const [job_id, setJob_id] = useState('');
    const [email, setEmail] = useState('');
    const [user_Type, setUser_Type] = useState('');
    const [user_Status, setUser_Status] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [pswd, setPswd] = useState('');
    const [pswdCnfrm, setPswdCnfrm] = useState('');
    const [jobTitles, setJobTitles] = useState<JobInfo[]>([]);

useEffect(() => {
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

        .then(async (data) => {
            setUser({
                ...data,
                jobInfo: data.jobInfo || { job_id: 0, job_title: '' }, 
            });

            if (data.jobInfo && data.jobInfo.job_id) {
                const jobResponse = await fetch(`${BASE_URL}/jobInfoes/${data.jobInfo.job_id}`);
                if (jobResponse.ok) {
                    const jobData = await jobResponse.json();
                    setUser(prev => ({ 
                        ...prev, 
                        jobInfo: {
                            ...prev.jobInfo,
                            job_title: jobData.job_title, 
                        },
                    })); 
                } else {
                    console.error('Failed to fetch job title');
                    sendLogToBackend('Failed to fetch job title: ', 'error');
                }
            }
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            sendLogToBackend('Error fetching data: ' + err, 'error');
            setError(err.message);
        });
        
        fetch(`${BASE_URL}/jobInfoes`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setJobTitles(data); 
        })
        .catch(err => {
            console.error('Fetch error for job titles:', err);
            sendLogToBackend('Fetch error for job titles: ' + err, 'error');
        });




}, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
       
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${BASE_URL}/users/${id}`, {
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
            navigate('/admin-dashboard/users'); 
        })
        .catch((error) => console.error('Error updating item:', error));
};

//cancel button
const handleCancel = () => {
    
      setUser_Id('');
      setFullname('');
      setJob_id('');
      setEmail('');
      setPhonenumber('');
      setUser_Type('');
      setUser_Status('');
      setPswd('');
      setPswdCnfrm('');
      window.location.reload(); 
      //navigate('/admin-dashboard/users'); 
  };

return (
    <div className='container'>
    <br/><br/>
    <div className='row justify-content-center'>
        <div className="card col-md-7">
            <h2 className='text-center'>Edit User</h2>
            <div className="card-body">
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="user_Id">User ID</label>
                    <input
                        type="text"
                        id={`user_Id`}
                        name="user_Id"
                        value={user.user_Id}
                        onChange={handleChange}
                        required
                        readOnly
                       
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id={`fullname`}
                        name="fullname"
                        value={user.fullname}
                        onChange={handleChange}
                        required
                       
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="job_title">Job Title:</label>
                    <select
                    id="job_title"
                    name="job_title"
                    value={user.jobInfo?.job_title || ''}
                    onChange={(e) => {
                        const selectedJobTitle = e.target.value;
                        setUser(prev => ({
                            ...prev,
                            jobInfo: {
                                ...prev.jobInfo,
                                job_title: selectedJobTitle,
                            },
                        }));
                    }}
                    required
                     >
                    <option value="" disabled>Select Job Title</option>
                    {jobTitles.map(job => (
                        <option key={job.job_id} value={job.job_title}>
                            {job.job_title}
                        </option>
                    ))}
                    </select>
                </div>
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
                    <label htmlFor={`phonenumber`}>Phone Number:</label>
                    <input
                        type="text"
                        id={`phonenumber`}
                        name={`phonenumber`}
                        value={user[`phonenumber`]}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`user_Type`}>Role:</label>
                    <select 
                            id={`user_Type`}
                            name='user_Type' 
                            value={user[`user_Type`]}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select role here</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Support">Support</option>
                           
                        </select>
                    
                </div>
                <div className="form-group">
                    <label htmlFor={`user_Status`}>Status:</label>
                    <select 
                            id={`user_Status`}
                            name='user_Status' 
                            value={user[`user_Status`]}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Update Status</option>
                            <option value="Active">Active</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                </div>
                
               
                <div className="form-group">
                    <label htmlFor={`pswd`}>Password</label>
                    <input
                        type="password"
                        id={`pswd`}
                        name={`pswd`}
                        value={user[`pswd`]}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>
                <button className='inc-cancel-button' type='submit'>Submit</button>
                <button className='inc-cancel-button' type='button' onClick={handleCancel}>Cancel</button>
            </form>
            </div>
        </div>
    </div>
</div>
  );
  };
export default EditUser;
