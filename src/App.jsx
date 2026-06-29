import { useRef } from "react";
import DocumentTable from "./components/DocumentTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleProvider } from "./context/RoleContext";
import Header from "./components/Header";

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
      <RoleProvider>
        <Header />
        <DocumentTable />
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
