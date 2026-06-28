import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { categoryFormLabel, statusFormLabel } from "../../const";
import { createDocument, updateDocument } from "../../services/apiHandlers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentSchema } from "../../services/schema";

export default function DocumentDialog({ open, onClose, mode, initialData }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      code: "",
      title: "",
      category: "",
      status: "",
      createdBy: "",
    },
    resolver: yupResolver(documentSchema),
  });

  React.useEffect(() => {
    reset(
      initialData || {
        code: "",
        title: "",
        category: "",
        status: "",
        createdBy: "",
      }
    );
  }, [initialData, reset]);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const onSubmit = (data) => {
    if (mode === "create") {
      const today = new Date();
      const formattedDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      createMutation.mutate({ ...data, createdDate: formattedDate });
    } else {
      updateMutation.mutate({ ...initialData, ...data });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Create Document" : "Edit Document"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {mode === "create"
            ? "Fill in the fields below to create a new document."
            : "Update the fields below and click Save to apply changes."}
        </DialogContentText>

        {/* Code */}
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label="Code"
              fullWidth
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          )}
        />

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        {/* Category Select */}
        <FormControl fullWidth margin="dense" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Category">
                {categoryFormLabel.map((item, index) => (
                  <MenuItem key={`${item}-${index}`} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.category.message}
            </p>
          )}
        </FormControl>

        {/* Status Select */}
        <FormControl fullWidth margin="dense" error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Status">
                {statusFormLabel.map((item, index) => (
                  <MenuItem key={`${item}-${index}`} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.status && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.status.message}
            </p>
          )}
        </FormControl>

        {/* Created By */}
        <Controller
          name="createdBy"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label="Created By"
              fullWidth
              error={!!errors.createdBy}
              helperText={errors.createdBy?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
