import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  //CHANGE ROLE HERE TO TEST DIFFERENT ROLES STAFF OR ADMIN
  const [role, setRole] = useState("STAFF");
  const [user, setUser] = useState("Alice");

  return (
    <RoleContext.Provider value={{ role, setRole, user }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
