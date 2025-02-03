
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../AuthService/Config'
import './AdminStyle.css';
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
  job_id: string;
  job_title: string; 
}

const UsersList: React.FC = () => {
  
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentJobTitle, setCurrentJobTitle] = useState<string | null>(null);
    const Loginvalue = sessionStorage.getItem('isLoggedIn');
    const Loginemail = sessionStorage.getItem('loginemail');
    const authToken = sessionStorage.getItem('authToken');

    useEffect(() => {
      if (!authToken) {
        navigate('/logins', { replace: true });  
    } else {
        console.log('User is authenticated. Token:', authToken);
    }      
    const fetchData = async () => {
        try {
        // Fetch the all users
          const typeResponse = await fetch(`${BASE_URL}/users`);
          if (!typeResponse.ok) throw new Error('Network response was not ok');
          const typeData = await typeResponse.json();
          setUsers(typeData);
          setLoadingUsers(false); 
          for (const user of typeData) {
          // Set the current job_title based on the fetched type data
          if (user.jobInfo && user.jobInfo.job_id) {
              const jobtitleResponse = await fetch(`${BASE_URL}/jobInfoes/${user.jobInfo.job_id}`);
              if (jobtitleResponse.ok) {
                const jobdata = await jobtitleResponse.json();
                setCurrentJobTitle(jobdata.job_title);
            } else {
                console.error('Failed to fetch job_title');
                sendLogToBackend('Failed to fetch job_title', 'error');
            }
            }

          }
          } catch (error) {
            console.error('Fetch error:', error);
            sendLogToBackend('Fetch error: ' + error, 'error');
          }
      };
      fetchData();


    }, []);


    const handleEditData = (id: number, usertype: string, useremail: string) => {
      navigate(`/admin-dashboard/edituser/${id}/${usertype}`);
    };
    const handleUsrCreateForm = () => {
      navigate(`/admin-dashboard/createuser/`);
    }
    // if (loadingUsers) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    return (
        <div>
      <h2>Users<a className="create-link" href="#"  onClick={(e) => { e.preventDefault(); handleUsrCreateForm()}}>Create</a></h2>
      <table className='users-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Status</th>
            <th>Role</th> 
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} >
            <td>{user.fullname}</td>
            <td>{user.jobInfo?.job_title || 'N/A'}</td>
            <td className={`status-indicator ${user.user_Status.toLowerCase()}`}>
            {user.user_Status}</td>
            <td>{user.user_Type}</td>
            {/* <td>
          <button className="users-button" onClick={() => handleEditData(user.user_id, user.user_Type, user.email)}>Edit</button>
          </td> */}
          <button className="users-button" onClick={() => handleEditData(user.user_id, user.user_Type, user.email)}>Edit</button>
        </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};


export default UsersList;
