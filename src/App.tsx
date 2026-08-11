import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import HeaderComponent from "./components/header";
import PerfumeQuiz from "./pages/Quize";
import IngredientsPage from "./pages/Ingritients";
import { ToastProvider } from "./components/toast";
import FormulaPage from "./pages/Formula";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <h2>About Page</h2>,
  },
  {
    path: "/quiz",
    element: <PerfumeQuiz />,
  },
  {
    path: "/notes-selection",
    element: <IngredientsPage />,
  },
  {
    path: "/formula/:id",
    element: <FormulaPage />,
  },
]);

export default function App() {
  return (
    <>
      <ToastProvider>
        <HeaderComponent />
        <RouterProvider router={router} />
      </ToastProvider>
    </>
  );
}
