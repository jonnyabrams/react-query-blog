import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Posts from "./components/Posts";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
};

export default App;
