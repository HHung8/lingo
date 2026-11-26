import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Path from "./pages/Path";
import Cards from "./pages/Cards";
import Quiz from "./pages/Quiz";
import AccountPage from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ja" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="path" element={<Path />} />
        <Route path="cards" element={<Cards />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/ja" replace />} />
    </Routes>
  );
}
