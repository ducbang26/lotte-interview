import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  LinearProgress,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { getDocuments, updateDocument } from "../../services/apiHandlers";
import ToolBar from "../ToolBar";
import ActionCell from "../ActionCell";
import StatusBadge from "../StatusBadge";
import { documentSchema } from "../../services/schema";
import { categoryFormLabel, statusFormLabel } from "../../const";
import EditIcon from "@mui/icons-material/Edit";

export default function DocumentTable() {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [status, setStatus] = React.useState("All");
  const [category, setCategory] = React.useState("All");
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [editingCell, setEditingCell] = React.useState(null);
  const [draftValues, setDraftValues] = React.useState({});
  const [cellErrors, setCellErrors] = React.useState({});

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "documents",
      {
        ...pagination,
        search: debouncedSearch,
        sortBy: "createdDate",
        sortDir: "desc",
        status,
        category,
      },
    ],
    queryFn: () =>
      getDocuments({
        ...pagination,
        search: debouncedSearch,
        sortBy: "createdDate",
        sortDir: "desc",
        status,
        category,
      }),
    keepPreviousData: true,
  });

  const columns = React.useMemo(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "title", header: "Title", isEdit: true },
      { accessorKey: "category", header: "Category", isEdit: true },
      {
        accessorKey: "status",
        header: "Status",
        isEdit: true,
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      },
      { accessorKey: "createdBy", header: "Created By" },
      { accessorKey: "createdDate", header: "Created Date" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionCell row={row} />,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data ? Math.ceil(data.total / pagination.pageSize) : -1,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = React.useCallback((val) => setSearch(val), []);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const startEdit = (rowId, columnId, initialValue) => {
    setEditingCell({ rowId, columnId });
    setDraftValues((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [columnId]: initialValue },
    }));
  };

  const handleChange = (rowId, columnId, value) => {
    setDraftValues((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [columnId]: value },
    }));
  };

  const handleSave = async (rowId, originalRow) => {
    const rowData = { ...originalRow, ...draftValues[rowId] };
    console.log("Data:", rowData, "Original:", originalRow);
    try {
      await documentSchema.validate(rowData, { abortEarly: false });

      updateMutation.mutate(
        { ...originalRow, ...rowData },
        {
          onSuccess: () => {
            setEditingCell(null);

            setDraftValues((prev) => {
              const { [rowId]: _, ...rest } = prev;
              return rest;
            });

            setCellErrors((prev) => ({ ...prev, [rowId]: {} }));
          },
        },
      );
    } catch (err) {
      if (err.inner) {
        const rowErrs = {};
        err.inner.forEach((e) => {
          rowErrs[e.path] = e.message;
        });
        setCellErrors((prev) => ({ ...prev, [rowId]: rowErrs }));
      }
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError)
    return <Typography color="error">Error loading documents</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Document List
      </Typography>

      {/* Toolbar */}
      <ToolBar
        search={search}
        setSearch={handleSearch}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
      />

      {isFetching && <LinearProgress sx={{ mb: 1 }} />}

      {/* Table */}
      <TableContainer component={Paper} sx={{ border: "1px solid #ddd" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ddd" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} sx={{ fontWeight: "bold" }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const columnDef = cell.column.columnDef;
                  const field = columnDef.accessorKey;
                  const isEditing =
                    editingCell?.rowId === row.id &&
                    editingCell?.columnId === field;
                  const value = draftValues[row.id]?.[field] ?? cell.getValue();
                  const errorMsg = cellErrors[row.id]?.[field];

                  return (
                    <TableCell key={cell.id}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover .edit-icon": { visibility: "visible" },
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          {isEditing ? (
                            field === "status" ? (
                              <FormControl
                                size="small"
                                fullWidth
                                error={!!errorMsg}
                              >
                                <Select
                                  value={value}
                                  autoFocus
                                  onChange={(e) =>
                                    handleChange(row.id, field, e.target.value)
                                  }
                                  onBlur={() =>
                                    handleSave(row.id, row.original)
                                  }
                                >
                                  {statusFormLabel.map((item, index) => (
                                    <MenuItem
                                      key={`${item}-${index}`}
                                      value={item}
                                    >
                                      {item}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errorMsg && (
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ ml: 1 }}
                                  >
                                    {errorMsg}
                                  </Typography>
                                )}
                              </FormControl>
                            ) : field === "category" ? (
                              <FormControl
                                size="small"
                                fullWidth
                                error={!!errorMsg}
                              >
                                <Select
                                  value={value}
                                  autoFocus
                                  onChange={(e) =>
                                    handleChange(row.id, field, e.target.value)
                                  }
                                  onBlur={() =>
                                    handleSave(row.id, row.original)
                                  }
                                >
                                  {categoryFormLabel.map((item, index) => (
                                    <MenuItem
                                      key={`${item}-${index}`}
                                      value={item}
                                    >
                                      {item}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errorMsg && (
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ ml: 1 }}
                                  >
                                    {errorMsg}
                                  </Typography>
                                )}
                              </FormControl>
                            ) : (
                              <TextField
                                value={value}
                                size="small"
                                autoFocus
                                error={!!errorMsg}
                                helperText={errorMsg}
                                onChange={(e) =>
                                  handleChange(row.id, field, e.target.value)
                                }
                                onBlur={() => handleSave(row.id, row.original)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSave(row.id, row.original);
                                  }
                                }}
                              />
                            )
                          ) : columnDef.cell ? (
                            flexRender(columnDef.cell, cell.getContext())
                          ) : (
                            value
                          )}
                        </Box>
                        {columnDef.isEdit && !isEditing && (
                          <IconButton
                            className="edit-icon"
                            size="small"
                            sx={{ visibility: "hidden" }}
                            onClick={() =>
                              startEdit(row.id, field, cell.getValue())
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data?.total ?? 0}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        onPageChange={(_, newPage) =>
          setPagination({ ...pagination, pageIndex: newPage })
        }
        onRowsPerPageChange={(e) =>
          setPagination({
            pageIndex: 0,
            pageSize: parseInt(e.target.value, 10),
          })
        }
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
