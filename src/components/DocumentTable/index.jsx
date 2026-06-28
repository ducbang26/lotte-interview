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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { getDocuments } from "../../services/apiHandlers";
import ToolBar from "../ToolBar";
import ActionCell from "../ActionCell";

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
      { accessorKey: "title", header: "Title" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "createdBy", header: "Created By" },
      { accessorKey: "createdDate", header: "Created Date" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionCell row={row} />,
      },
    ],
    []
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
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:hover": { backgroundColor: "grey.50" } }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
