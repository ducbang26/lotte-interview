import React from "react";
import { Chip } from "@mui/material";

const statusColors = {
  Approved: "success",
  Pending: "warning",
  Draft: "default",
};

export default function StatusBadge({ status }) {
  const color = statusColors[status] || "default";

  return (
    <Chip
      label={status}
      color={color}
      variant="outlined"
      size="small"
      sx={{
        fontWeight: "bold",
        textTransform: "capitalize",
      }}
    />
  );
}
