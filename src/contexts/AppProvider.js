import React, { useState } from 'react';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [menuToggleCollapsed, setMenuToggleCollapsed] = useState(false);
  const [statisticSource, setStatisticSource] = useState(null);

  return (
    <AppContext.Provider
      value={{
        menuToggleCollapsed,
        setMenuToggleCollapsed,
        setStatisticSource,
        statisticSource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
