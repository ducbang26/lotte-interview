import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import FilePresentIcon from "@mui/icons-material/FilePresent";

export default function BulkImportModal({ open, onClose, onImport, loading }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMap, setErrorMap] = useState({});
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(null);

  // ✅ cleanup interval
  useEffect(() => {
    return () => clearInterval(progressRef.current);
  }, []);

  // ✅ Drop + fake progress
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setRows([]);
    setErrorMap({});
    setParsing(true);
    setProgress(0);

    // ✅ fake smooth progress (0 → 95%)
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + (prev > 80 ? 0.5 : 1); // chậm dần cuối
      });
    }, 50);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,

      complete: (result) => {
        clearInterval(progressRef.current);

        setRows(result.data);
        setProgress(100);

        setTimeout(() => {
          setParsing(false);
        }, 200);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  const handleClose = () => {
    setRows([]);
    setFileName("");
    setErrorMap({});
    setParsing(false);
    setProgress(0);
    clearInterval(progressRef.current);
    onClose();
  };

  const handleImport = async () => {
    const res = await onImport(rows);

    if (res?.errors) {
      const map = {};
      res.errors.forEach((e) => {
        map[e.row - 2] = e;
      });
      setErrorMap(map);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bulk Import Documents</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(0, 120, 255, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2">
            Need a sample CSV to test performance? Download a structured
            spreadsheet with 10,000 rows.
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<FilePresentIcon />}
            href="/documents.csv"
            download
          >
            Get 10k Sample
          </Button>
        </Box>
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: "center",
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.400",
            bgcolor: isDragActive ? "grey.100" : "background.paper",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          <UploadFileIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />

          <Typography>
            {isDragActive
              ? "Drop CSV file..."
              : "Drag & drop or click to upload CSV"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Only .csv supported
          </Typography>
        </Paper>

        {/* ✅ Progress */}
        {parsing && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Parsing CSV... {Math.round(progress)}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {/* ✅ File name */}
        {fileName && (
          <Typography sx={{ mt: 2 }}>
            📄 <strong>{fileName}</strong>
          </Typography>
        )}

        {/* ✅ Preview */}
        {rows.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preview ({rows.length} rows)
            </Typography>

            {Object.keys(errorMap).length > 0 && (
              <Typography color="error" sx={{ mb: 1 }}>
                {Object.keys(errorMap).length} row(s) have errors
              </Typography>
            )}

            <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Error</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => {
                    const error = errorMap[index];

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: error
                            ? "rgba(255,0,0,0.05)"
                            : "inherit",
                          borderLeft: error ? "4px solid red" : "none",
                        }}
                      >
                        <TableCell
                          sx={{
                            color:
                              error?.field === "code"
                                ? "error.main"
                                : "inherit",
                            fontWeight: error?.field === "code" ? 600 : 400,
                          }}
                        >
                          {row.code}
                        </TableCell>

                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.status}</TableCell>

                        <TableCell>
                          {error && (
                            <Typography variant="caption" color="error">
                              {error.error}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleImport}
          disabled={
            rows.length === 0 ||
            loading ||
            parsing ||
            Object.keys(errorMap).length > 0
          }
        >
          {loading ? "Importing..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
