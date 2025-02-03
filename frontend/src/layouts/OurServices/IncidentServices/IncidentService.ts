
import axios from 'axios';
import { BASE_URL } from '../../../AuthService/Config';


const API_URL = `${BASE_URL}/incidents`;

// Define the Incident interface
interface Incident {
    inc_id?: number;
    inc_summary: string;
    inc_description: string;
    // inc_priority:string,
    // inc_impact: string,
    // inc_affected_user: string,
    // inc_contact_name: string,
    // inc_contact_email: string,
    // Add other relevant fields as needed
}


export const getAllIncidents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getIncidentById = async (inc_id: number) => {
    const response = await axios.get(`${API_URL}/${inc_id}`);
    return response.data;
};

