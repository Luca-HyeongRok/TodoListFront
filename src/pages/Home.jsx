import { useContext } from "react";
import {
  TodoStateContext,
  TodoDispatchContext,
} from "../../context/TodoContext";
import Header from "../Header";
import Editor from "../Editor";
import List from "../List";
import Footer from "../Footer";

const Home = () => {
  const { todos, selectedDate } = useContext(TodoStateContext);
  const { dispatch, setSelectedDate } = useContext(TodoDispatchContext);

  // 날짜 변경 함수: dispatch를 사용해 날짜 변경
  const moveDate = (direction, date = null) => {
    const newDate = date ? new Date(date) : new Date(selectedDate);
    if (!date) {
      newDate.setDate(newDate.getDate() + direction);
    }
    dispatch({ type: "CHECK_DATE", date: newDate }); // 짜 변경 액션 호출
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
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        moveDate={moveDate}
      />
      <div className="main-content">
        <Editor selectedDate={selectedDate} onCreate={handleCreate} />
        <List todos={todos} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
