import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound"; // 선택 사항

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} /> {/* 메인 페이지 */}
        <Route path="/" element={<Login />} /> {/* 로그인 */}
        <Route path="/register" element={<Register />} /> {/* 회원가입 */}
        <Route path="*" element={<NotFound />} /> {/* 404 페이지 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
