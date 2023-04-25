import axios from "axios";
import { useState, useEffect } from "react";
import PaginationTable from "./Table";
import { QueryClientProvider, QueryClient } from "react-query";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://dummyjson.com/products").then((response) => {
      setProducts(response.data.products);
      setLoading(false);
    });
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PaginationTable products={products} />
    </QueryClientProvider>
  );
}

export default App;
