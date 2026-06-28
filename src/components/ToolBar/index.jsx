import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { categoryLabel, statusLabel } from "../../const";
import DocumentDialog from "../DocumentDialog";

function Toolbar({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
}) {
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120, flexGrow: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusLabel.map((item, index) => (
              <MenuItem key={`${item}-${index}`} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120, flexGrow: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryLabel.map((item, index) => (
              <MenuItem key={`${item}-${index}`} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search by Title/Code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          onClick={() => setOpenCreateDialog(true)}
          variant="contained"
          sx={{ bgcolor: "success.main" }}
        >
          + Add Document
        </Button>
        <Button variant="outlined" sx={{ borderColor: "grey.400" }}>
          Bulk Import
        </Button>
      </Box>
      <DocumentDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        mode={"create"}
        initialData={{
          code: "",
          title: "",
          category: "",
          status: "",
          createdBy: "",
        }}
      />
    </>
  );
}

export default React.memo(Toolbar);
