import { useState, useEffect, useMemo, useContext } from "react";
import "./List.css";
import TodoItem from "./TodoItem";
import { TodoStateContext } from "../context/TodoContext";
import { apiRequest } from "../utils/api";

const List = () => {
  const { todos } = useContext(TodoStateContext) || { todos: [] };
  const [search, setSearch] = useState("");
  const [filteredTodos, setFilteredTodos] = useState(
    Array.isArray(todos) ? todos : []
  );

  // 검색 결과 가져오기
  const fetchSearchResults = async (keyword) => {
    try {
      const encodedKeyword = encodeURIComponent(keyword);
      return await apiRequest(`/todos/search?keyword=${encodedKeyword}`);
    } catch (error) {
      console.error("검색 실패:", error);
      return [];
    }
  };

  // 검색어 입력 시 처리
  const onChangeSearch = async (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);

    if (newSearch === "") {
      setFilteredTodos(Array.isArray(todos) ? todos : []);
    } else {
      const searchResults = await fetchSearchResults(newSearch);
      setFilteredTodos(searchResults);
    }
  };

  // todos 값이 변경될 때 `filteredTodos` 업데이트
  useEffect(() => {
    setFilteredTodos(Array.isArray(todos) ? todos : []);
  }, [todos]);

  // 통계 계산 (할 일 개수, 완료 개수, 미완료 개수)
  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    const totalCount = Array.isArray(todos) ? todos.length : 0;
    const doneCount =
      totalCount > 0 ? todos.filter((todo) => todo.done).length : 0;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]);

  return (
    <div className="List">
      <div className="TotalCheck">
        <div>
          📆 오늘의 할 일 : {totalCount}개 ⭕ 완료 : {doneCount}개 ❌ 미완료 :{" "}
          {notDoneCount}개
        </div>
      </div>

      {/* 검색 입력 필드 */}
      <input
        value={search}
        onChange={onChangeSearch}
        placeholder="검색어를 입력하세요"
      />

      {/* 검색된 할 일 목록 표시 */}
      <div className="todos_wrapper">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => <TodoItem key={todo.listId} {...todo} />)
        ) : (
          <p>😢 검색된 할 일이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default List;
