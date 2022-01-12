import React, { useState } from 'react';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [menuToggleCollapsed, setMenuToggleCollapsed] = useState(false);

  return (
    <AppContext.Provider value={{ menuToggleCollapsed, setMenuToggleCollapsed }}>
      {children}
    </AppContext.Provider>
  );
}
