import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// UserProvider to wrap the app and provide the user context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the UserContext so that it can be used elsewhere
export { UserContext };
