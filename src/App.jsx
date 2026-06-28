import { useRef } from "react";
import DocumentTable from "./components/DocumentTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentTable />
    </QueryClientProvider>
  );
}

export default App;
