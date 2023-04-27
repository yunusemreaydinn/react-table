import PaginationTable from "./Pagination";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <PaginationTable />
    </QueryClientProvider>
  );
}

export default App;
