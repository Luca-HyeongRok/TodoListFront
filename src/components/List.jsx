import { useState, useMemo, useContext } from "react";
import "./List.css";
import TodoItem from "./TodoItem";
import { TodoStateContext } from "../pages/Home";

const List = () => {
  const todos = useContext(TodoStateContext);
  const [search, setSearch] = useState("");

  const onChangeSerch = (e) => {
    setSearch(e.target.value);
  };

  const getFilteredData = () => {
    if (search === "") {
      return todos;
    }
    return todos.filter((todo) =>
      todo.content.toLowerCase().includes(search.toLowerCase())
    );
  };

  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.done).length;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]); // todos 배열이 변경될 때만 계산하도록 의존성 배열에 todos 추가

  const filteredTodos = getFilteredData();

  return (
    <div className="List">
      <div className="TotalCheck">
        <div>
          📆오늘의 할 일 : {totalCount}개 ⭕완료 : {doneCount}개 ❌미완료:
          {notDoneCount}개
        </div>
      </div>

      <input
        value={search}
        onChange={onChangeSerch}
        placeholder="검색어를 입력하세요"
      />
      <div className="todos_wrapper">
        {filteredTodos.map((todo) => {
          // 여기서 `key` 값을 `todo.listId`로 설정합니다
          return <TodoItem key={todo.listId} {...todo} />;
        })}
      </div>
    </div>
  );
};

export default List;
