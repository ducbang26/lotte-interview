import React from "react";
import { useRole } from "../../context/RoleContext";
import { MenuItem, Select, Typography } from "@mui/material";

export default function Header() {
  const { role, setRole, user } = useRole();

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        color: "black",
      }}
    >
      <Typography variant="h3">File Management Module</Typography>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span>Role:</span>

        <Select size="small" value={role} onChange={handleChange}>
          <MenuItem value="STAFF">STAFF</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
        </Select>
      </div>
    </header>
  );
}
