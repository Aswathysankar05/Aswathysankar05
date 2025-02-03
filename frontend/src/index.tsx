import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import EditItem from './Admin/EditItem';
import EditUser from './Admin/EditUser';
import TicketList from './Admin/TicketList';
import UsersList from './Admin/UsersList';
import WorkHistory from './Admin/WorkHistory';
import AdminSettings from './Admin/AdminSettings';
import App from './App';
import { AuthProvider } from './AuthService/AuthContext';
import './index.css';
import LoginPage from './layouts/HomePage/LoginPage';
import ChangesPage from './layouts/OurServices/ChangeRequestServices/ChangesPage';
import IncidentsPage from './layouts/OurServices/IncidentServices/IncidentsPage';
import { NewIncident } from './layouts/OurServices/IncidentServices/NewIncident';
import { NewRequest } from './layouts/OurServices/RequestServices/NewRequest';
import { NewChangeRequest } from './layouts/OurServices/ChangeRequestServices/NewChangeRequest';
import RequestsPage from './layouts/OurServices/RequestServices/RequestsPage';
import SupportDashboard from './Support/SupportDashboard';
import SupportViewTickets  from './Support/SupportViewTickets';
import SupportProfile from './Support/SupportProfile';
import SupportWorkHistory from './Support/SupportWorkHistory';
import SupportCreateTicket from './Support/SupportCreateTicket';
import UserDashboard from './User/UserDashboard';
import ViewTickets from './User/ViewTickets';
import UserEditItem from './User/UserEditItem';
import UserProfile from './User/UserProfile';
import UserTickets from './User/UserTickets';
import { CreateUser } from './Admin/CreateUser';
import UserWorkHistory from './User/UserWorkHistory';
import CreateTicket from './User/CreateTicket';
import log from 'loglevel';


log.setLevel('debug');
log.debug("React Application started");
// Create a root
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/changes" element={<ChangesPage />} />
        <Route path="/logins" element={<LoginPage />} /> 
       
       <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="tickets" element={<TicketList />} /> 
          <Route path="users" element={<UsersList />} /> 
          <Route path="settings" element={<AdminSettings />} /> 
        </Route>
        <Route path="/admin-dashboard/edit/:type/:id" element={<EditItem />} />
        <Route path="/admin-dashboard/edituser/:id/:usertype" element={<EditUser />} />
        <Route path="/admin-dashboard/tickets/workhistory/:type/:workid" element={<WorkHistory />} />
        <Route path="/admin-dashboard/newincident/" element={<NewIncident />} />
        <Route path="/admin-dashboard/newrequest/" element={<NewRequest />} />
        <Route path="/admin-dashboard/newchangerequest/" element={<NewChangeRequest />} />
        <Route path="/admin-dashboard/createuser/" element={<CreateUser />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/users/:id" element={<EditUser />}></Route>
        <Route path="/user-dashboard/edit/:type/:id" element={<UserEditItem />} />
        <Route path="/user-dashboard/viewtickets/:type" element={<ViewTickets />} /> 
        <Route path="/user-dashboard/viewtickets/userworkhistory/:type/:workid" element={<UserWorkHistory />} />
        <Route path="/user-dashboard/viewtickets/createticket/:type" element={<CreateTicket />} /> 
        <Route path="/user-dashboard/user-profile" element={<UserProfile />} /> 

        <Route path="/support-dashboard" element={<SupportDashboard />} />
		    <Route path="/support-dashboard/supportviewtickets/:type" element={<SupportViewTickets />} /> 
        <Route path="/support-dashboard/supportviewtickets/supportworkhistory/:type/:workid" element={<SupportWorkHistory />} />
        <Route path="/support-dashboard/userworkhistory/:type/:workid" element={<SupportWorkHistory />} />
        <Route path="/support-dashboard/supportviewtickets/createticket/:type" element={<SupportCreateTicket />} /> 
        <Route path="/support-dashboard/support-profile" element={<SupportProfile />} /> 

      </Routes>
    </Router>
  </AuthProvider>
);
  
