
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../AuthService/Config';
import './AdminStyle.css';
import { sendLogToBackend } from '../utils/logger';

interface Job {
    job_id: string; 
    job_title: string; 
}

export const CreateUser = () => {
   
    const [user_id, setUser_Id] = useState('');
    const [fullname, setFullname] = useState('');
    const [job_id, setJob_id] = useState('');
    const [email, setEmail] = useState('');
    const [user_Type, setUser_Type] = useState('');
    const [user_Status, setUser_Status] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [pswd, setPswd] = useState('');
    const [pswdCnfrm, setPswdCnfrm] = useState('');
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const authToken = sessionStorage.getItem('authToken');

    // Fetch work history data
    useEffect(() => {
        if (!authToken) {
            navigate('/logins', { replace: true });  
        } else {
            console.log('User is authenticated. Token:', authToken);
        }
        const fetchData = async () => {
    try {
        

        //Fetch the Job title
        const jobResponse = await fetch(`${BASE_URL}/jobInfoes`);
        if (!jobResponse.ok) throw new Error('Network response was not ok');
        const jobData = await jobResponse.json();
        setJobs(jobData); 



    } catch (error) {
        console.error('Fetch error:', error);
        sendLogToBackend('Fetch error: ' + error, 'error');
            }
    };
    fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
	
		// Check if the input is for status_id
		if (name === 'job_id') {
			setFormData({ 
				...formData, 
				jobInfo: {
					...formData.jobInfo,
					job_id: value // Update only the status_id
				} 
			});
		} 
	};




    //cancel button
    const handleCancel = () => {
      //  setFormData(types); // Reset to original data
        setUser_Id('');
        setFullname('');
        setJob_id('');
        setEmail('');
        setPhonenumber('');
        setUser_Type('');
        setUser_Status('');
        setPswd('');
        setPswdCnfrm('');
        window.location.reload(); // Refresh the page
    };
    // Handles the submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

         // Password validation
    if (pswd !== pswdCnfrm) {
        alert("Passwords do not match!");
        return;
    }

    // Email validation (simple regex for email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return;
    }

    // Phone number validation (optional: ensuring it has a minimum length)
    if (phonenumber.length < 10) {
        alert("Please enter a valid phone number!");
        return;
    }
    //alert("values"+user_id +fullname +job_id +email +pswd +pswdCnfrm +user_Type +user_Status +phonenumber ) 
        const userData = {

            user_id:  user_id,
            fullname: fullname,
            jobInfo: { job_id },
            email: email,
            pswd: pswd,
            pswdCnfrm: pswdCnfrm,
            user_Type: user_Type,
            user_Status: "Active",
            phonenumber: phonenumber,

            // user_id:  "1",
            // fullname: "Test",
            // jobInfo: { job_id },
            // email: "test@gmail.com",
            // pswd: "123",
            // pswdCnfrm: "123",
            // user_Type: "Admin",
            // user_Status: "Active",
            // phonenumber: "1234567890",
        };

       // alert("values"+userData.user_id +userData.fullname +userData.email +userData.pswd +userData.pswdCnfrm +userData.user_Type +userData.user_Status +userData.phonenumber ) 
        try {
        const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData),
        });



      if (!response.ok) {
          throw new Error('Failed to update data');
        }
      window.location.reload();
        } catch (error) {
        console.error('Error Creating User:', error);
        sendLogToBackend('Error Creating User: ' + error, 'error');
      }
    };
    return (
<div className='container'>
<br/><br/>
    <div className='row justify-content-center'>
        <div className="card col-md-7">
            <h2 className='text-center'> Create New User</h2>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Full Name</label>
                        <input 
                        type='text' 
                        name='fullname' 
                        value= {fullname}
                        className='form-control'
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                    {/* <div className='form-group mb-2'>
                        <label className='form-label'>Job Title</label>
                        <input 
                        type='text' 
                        name='title' 
                        value= {job_id}
                        className='form-control'
                        onChange={(e) => setJob_id(e.target.value)}
                        required
                        >
                        </input>
                    </div> */}
                    <div className='form-group mb-2'>
                        <label className='form-label'>Job Title</label>
                        {/* <select 
                            name='job_id' 
                            value={job_id} 
                            className='form-control' 
                            onChange={(e) => setJob_id(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Job Title here</option>
                            <option value="Active">Active</option>
                            <option value="Disabled">Disabled</option>
                           
                        </select> */}
                        <select id="status_id" name="status_id" className="small-text"  onChange={(e) => setJob_id(e.target.value)} required >
                        <option value="" disabled selected>Select your Job Title</option>
                        {jobs.map((job) => (
                        <option key={job.job_id} value={job.job_id}>
                        {job.job_title}
                        </option>
                        ))}
                        </select>
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Email</label>
                        <input 
                        type='email' 
                        name='email' 
                        value= {email}
                        className='form-control'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        >
                        </input>
                    </div>

                    <div className='form-group mb-2'>
                        <label className='form-label'>Phone Number</label>
                        <input 
                        type='text' 
                        name='phonenumber' 
                        value= {phonenumber}
                        className='form-control'
                        onChange={(e) => setPhonenumber(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Role</label>
                        <select 
                            name='user_Type' 
                            value={user_Type} 
                            className='form-control' 
                            onChange={(e) => setUser_Type(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select role here</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Support">Support</option>
                           
                        </select>
                    </div>
                    
                    <div className='form-group mb-2'>
                        <label className='form-label'>Password</label>
                        <input 
                        type='password' 
                        name='pswd' 
                        value= {pswd}
                        className='form-control'
                        onChange={(e) => setPswd(e.target.value)}
                        required
                        >
                        </input>
                    </div>

                    <div className='form-group mb-2'>
                        <label className='form-label'>Confirm Password</label>
                        <input 
                        type='password' 
                        name='pswdCnfrm' 
                        value= {pswdCnfrm}
                        className='form-control'
                        onChange={(e) => setPswdCnfrm(e.target.value)}
                        required
                        >
                        </input>
                    </div>
                   
                    <button className='inc-cancel-button' type='submit'>Submit</button>
                    <button className='inc-cancel-button' type='button' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
</div>
    
 

    );
}