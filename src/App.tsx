import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes/router";
import { PuffLoader } from "react-spinners";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <PuffLoader />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
