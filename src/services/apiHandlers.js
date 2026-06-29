import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  const delay = 300 + Math.random() * 700;
  await sleep(delay);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (Math.random() < 0.1) {
      return Promise.reject(new Error("Simulated network error"));
    }
    return Promise.reject(error);
  }
);

// GET documents query params: page, pageSize, search, sortBy, sortDir, status, category
export const getDocuments = async (params) => {
  const res = await api.get("/documents", { params });
  return res.data;
};

// POST create document
export const createDocument = async (doc) => {
  const res = await api.post("/documents", doc);
  return res.data;
};

// PUT update document
export const updateDocument = async (doc) => {
  const res = await api.put(`/documents/${doc.id}`, doc);
  return res.data;
};

// DELETE document
export const deleteDocument = async (id) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};

// Bulk import
export const bulkImportDocuments = async (rows) => {
  const res = await api.post("/documents/bulk-import", rows);
  return res.data;
};
