import { http, HttpResponse } from "msw";

let documents = [
  {
    id: "1",
    code: "DOC001",
    title: "Employee Handbook",
    category: "HR",
    status: "Approved",
    createdBy: "Admin",
    createdDate: "2026-06-01",
  },
  {
    id: "2",
    code: "DOC002",
    title: "Finance Report",
    category: "Finance",
    status: "Pending",
    createdBy: "Staff",
    createdDate: "2026-06-15",
  },
  {
    id: "3",
    code: "DOC003",
    title: "Policy Update",
    category: "Legal",
    status: "Draft",
    createdBy: "Admin",
    createdDate: "2026-06-20",
  },
  {
    id: "4",
    code: "DOC004",
    title: "Marketing Strategy",
    category: "Marketing",
    status: "Approved",
    createdBy: "Alice",
    createdDate: "2026-06-05",
  },
  {
    id: "5",
    code: "DOC005",
    title: "Sales Report Q2",
    category: "Finance",
    status: "Draft",
    createdBy: "Bob",
    createdDate: "2026-06-10",
  },
  {
    id: "6",
    code: "DOC006",
    title: "Training Schedule",
    category: "HR",
    status: "Pending",
    createdBy: "Carol",
    createdDate: "2026-06-12",
  },
  {
    id: "7",
    code: "DOC007",
    title: "Contract Agreement",
    category: "Legal",
    status: "Approved",
    createdBy: "David",
    createdDate: "2026-06-14",
  },
  {
    id: "8",
    code: "DOC008",
    title: "Product Launch Plan",
    category: "Project",
    status: "Pending",
    createdBy: "Eve",
    createdDate: "2026-06-16",
  },
  {
    id: "9",
    code: "DOC009",
    title: "Budget Overview",
    category: "Finance",
    status: "Draft",
    createdBy: "Frank",
    createdDate: "2026-06-18",
  },
  {
    id: "10",
    code: "DOC010",
    title: "Recruitment Policy",
    category: "HR",
    status: "Approved",
    createdBy: "Grace",
    createdDate: "2026-06-19",
  },
  {
    id: "11",
    code: "DOC011",
    title: "Security Guidelines",
    category: "IT",
    status: "Pending",
    createdBy: "Admin",
    createdDate: "2026-06-21",
  },
  {
    id: "12",
    code: "DOC012",
    title: "Annual Report",
    category: "Finance",
    status: "Approved",
    createdBy: "Staff",
    createdDate: "2026-06-22",
  },
  {
    id: "13",
    code: "DOC013",
    title: "Customer Feedback",
    category: "Marketing",
    status: "Draft",
    createdBy: "Alice",
    createdDate: "2026-06-23",
  },
  {
    id: "14",
    code: "DOC014",
    title: "Project Timeline",
    category: "Project",
    status: "Pending",
    createdBy: "Bob",
    createdDate: "2026-06-24",
  },
  {
    id: "15",
    code: "DOC015",
    title: "Legal Compliance",
    category: "Legal",
    status: "Approved",
    createdBy: "Carol",
    createdDate: "2026-06-25",
  },
  {
    id: "16",
    code: "DOC016",
    title: "Team Meeting Notes",
    category: "Project",
    status: "Draft",
    createdBy: "David",
    createdDate: "2026-06-26",
  },
  {
    id: "17",
    code: "DOC017",
    title: "Supplier Contracts",
    category: "Legal",
    status: "Pending",
    createdBy: "Eve",
    createdDate: "2026-06-27",
  },
  {
    id: "18",
    code: "DOC018",
    title: "Onboarding Checklist",
    category: "HR",
    status: "Approved",
    createdBy: "Frank",
    createdDate: "2026-06-28",
  },
  {
    id: "19",
    code: "DOC019",
    title: "Expense Report",
    category: "Finance",
    status: "Draft",
    createdBy: "Grace",
    createdDate: "2026-06-29",
  },
  {
    id: "20",
    code: "DOC020",
    title: "Marketing Campaign",
    category: "Marketing",
    status: "Pending",
    createdBy: "Admin",
    createdDate: "2026-06-30",
  },
  {
    id: "21",
    code: "DOC021",
    title: "Audit Findings",
    category: "Finance",
    status: "Approved",
    createdBy: "Staff",
    createdDate: "2026-07-01",
  },
  {
    id: "22",
    code: "DOC022",
    title: "Risk Assessment",
    category: "Project",
    status: "Draft",
    createdBy: "Alice",
    createdDate: "2026-07-02",
  },
  {
    id: "23",
    code: "DOC023",
    title: "Training Materials",
    category: "HR",
    status: "Pending",
    createdBy: "Bob",
    createdDate: "2026-07-03",
  },
  {
    id: "24",
    code: "DOC024",
    title: "Legal Notice",
    category: "Legal",
    status: "Approved",
    createdBy: "Carol",
    createdDate: "2026-07-04",
  },
  {
    id: "25",
    code: "DOC025",
    title: "System Upgrade Plan",
    category: "IT",
    status: "Draft",
    createdBy: "David",
    createdDate: "2026-07-05",
  },
];

export const handlers = [
  // GET /api/documents
  http.get("/api/documents", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sortBy = url.searchParams.get("sortBy") || "";
    const sortDir = url.searchParams.get("sortDir") || "desc";
    const status = url.searchParams.get("status") || "All";
    const category = url.searchParams.get("category") || "All";

    let filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.code.toLowerCase().includes(search.toLowerCase())
    );

    if (status !== "All") {
      filtered = filtered.filter((doc) => doc.status === status);
    }

    if (category !== "All") {
      filtered = filtered.filter((doc) => doc.category === category);
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by createdDate ascending (earliest first)
      filtered.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paged,
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  // POST /api/documents
  http.post("/api/documents", async ({ request }) => {
    const newDoc = await request.json();
    newDoc.id = String(Date.now());
    documents.push(newDoc);
    return HttpResponse.json(newDoc, { status: 201 });
  }),

  // PUT /api/documents/:id
  http.put("/api/documents/:id", async ({ params, request }) => {
    const updatedDoc = await request.json();
    documents = documents.map((doc) =>
      doc.id === params.id ? { ...doc, ...updatedDoc } : doc
    );
    return HttpResponse.json(updatedDoc);
  }),

  // DELETE /api/documents/:id
  http.delete("/api/documents/:id", ({ params }) => {
    documents = documents.filter((doc) => doc.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // Bulk import
  http.post("/api/documents/bulk-import", async ({ request }) => {
    const rows = await request.json();
    const invalidRows = rows.filter((row) => !row.code || !row.title);
    const validRows = rows.filter((row) => row.code && row.title);

    validRows.forEach((row) => {
      row.id = String(Date.now() + Math.random());
      documents.push(row);
    });

    return HttpResponse.json({
      imported: validRows.length,
      invalid: invalidRows,
    });
  }),
];
