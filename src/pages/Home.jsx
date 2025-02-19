import { useContext, useEffect, useState } from "react";
import { TodoStateContext, TodoDispatchContext } from "../context/TodoContext";
import Header from "../components/Header";
import Editor from "../components/Editor";
import List from "../components/List";
import Footer from "../components/Footer";
import { checkSession } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { todos, selectedDate } = useContext(TodoStateContext) || {
    todos: [],
    selectedDate: new Date(),
  }; // 구조분해 할당
  const dispatch = useContext(TodoDispatchContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const user = await checkSession();
      if (!user) {
        setIsAuthenticated(false);
        navigate("/"); //세션이 없으면 로그인 페이지로 이동
      } else {
        dispatch({ type: "SET_USER", user }); // 세션 정보 업데이트
      }
    };

    verifySession();
  }, []);

  // 날짜 변경 함수: dispatch를 사용해 날짜 변경
  const moveDate = (direction, date = null) => {
    const newDate = date ? new Date(date) : new Date(selectedDate);
    if (!date) {
      newDate.setDate(newDate.getDate() + direction);
    }
    console.log("new Date 호출 - 변경된 날짜", newDate);
    dispatch({ type: "CHANGE_DATE", date: newDate }); // 짜 변경 액션 호출
  };

  const handleCreate = (content, priority, startDate, endDate) => {
    dispatch({
      type: "CREATE",
      data: { content, priority, startDate, endDate },
    });
  };

  const handleEdit = (
    listId,
    newContent,
    newPriority,
    newStartDate,
    newEndDate
  ) => {
    dispatch({
      type: "EDIT",
      targetId: listId,
      newContent,
      newPriority,
      newStartDate,
      newEndDate,
    });
  };

  const handleDelete = (listId) => {
    dispatch({ type: "DELETE", targetId: listId });
  };

  return (
    <div className="home-container">
      <Header selectedDate={selectedDate} moveDate={moveDate} />
      <div className="main-content">
        <Editor selectedDate={selectedDate} />
        <List todos={todos} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
