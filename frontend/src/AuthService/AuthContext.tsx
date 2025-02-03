import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { sendLogToBackend } from '../utils/logger';

// Define the shape of the AuthContext
// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: () => void;
//   logout: () => void;
// }

// Create the AuthContext
export const AuthContext = createContext<any>(null);
//<AuthContextType | undefined>(undefined);

const SESSION_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds


// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(sessionStorage.getItem('authToken'));

// Check local storage for login status on component mount
  useEffect(() => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    
    const storedExpirationTime = sessionStorage.getItem('expirationTime');

    const currentTime = new Date().getTime();

    if (storedLoginStatus === 'true' && storedExpirationTime) {
        // setIsLoggedIn(true); 
        if (currentTime < parseInt(storedExpirationTime)) {
          setIsLoggedIn(true);
        } else {
          // Clear the session if expired
          sessionStorage.removeItem('isLoggedIn');
          sessionStorage.removeItem('expirationTime');
        }
    }

}, []);

// Login function to set user as logged in
  const login = (token: string) => {
    console.log('User logging in...');
    sendLogToBackend('User logging in...', 'info');
     setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('authToken', token);
    setAuthToken(token);

      // Set the expiration time
      const expirationTime = new Date().getTime() + SESSION_EXPIRATION_TIME;
      sessionStorage.setItem('expirationTime', expirationTime.toString());

    // alert('User logging in...'+isLoggedIn);
};


  // Logout function to set user as logged out
const logout = () => {
    console.log('Logging out...');
    sendLogToBackend('Logging out...', 'info');
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('expirationTime');
    //alert('Logging out...');
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
    
};


  // Provide the context value to the children components
  return (
    // <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
    <AuthContext.Provider value={{ authToken, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

// Custom hook to use the AuthContext
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;



};



// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: any) => {
//     const [authToken, setAuthToken] = useState<string | null>(sessionStorage.getItem('authToken'));

//     const login = (token: string) => {
//         sessionStorage.setItem('authToken', token);
//         setAuthToken(token);
//     };

//     const logout = () => {
//         sessionStorage.removeItem('authToken');
//         setAuthToken(null);
//     };

//     return (
//         <AuthContext.Provider value={{ authToken, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
