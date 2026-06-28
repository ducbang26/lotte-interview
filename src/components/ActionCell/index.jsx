import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentDialog from "../DocumentDialog";
import { deleteDocument } from "../../services/apiHandlers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "../../context/RoleContext";

export default function ActionCell({ row }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState({});
  const { role, user } = useRole();

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const handleEdit = () => {
    setOpenEditDialog(true);
    setSelectedDoc(row.original);
    console.log("Edit document:", row.original);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(row.original.id);
    console.log("Delete document:", row.original);
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="edit">
          <IconButton color="primary" size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="delete">
          {role === "STAFF" && row.original.createdBy === user && (
            <IconButton
              color="error"
              size="small"
              onClick={() => setOpen(true)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Tooltip>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to delete this document?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>cancel</Button>
            <Button color="error" onClick={handleDeleteConfirm}>
              delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <DocumentDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        mode={"edit"}
        initialData={selectedDoc}
      />
    </>
  );
}
