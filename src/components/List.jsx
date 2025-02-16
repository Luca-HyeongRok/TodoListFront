import { useState, useEffect, useMemo, useContext } from "react";
import "./List.css";
import TodoItem from "./TodoItem";
import { TodoStateContext } from "../pages/Home";
import { BASE_URL } from "../config";

const List = () => {
  const todos = useContext(TodoStateContext);
  const [search, setSearch] = useState("");
  const [filteredTodos, setFilteredTodos] = useState(todos);

  // 백엔드에서 검색 결과 가져오는 함수
  const fetchSearchResults = async (keyword) => {
    try {
      // 검색어를 URL에 맞게 인코딩 (한글 깨짐 방지)
      const encodedKeyword = encodeURIComponent(keyword);

      const response = await fetch(
        `${BASE_URL}/todos/search?keyword=${encodedKeyword}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("검색 결과를 불러오는 데 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("검색 오류:", error);
      return [];
    }
  };

  // 검색어 입력 시 처리
  const onChangeSearch = async (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);

    if (newSearch === "") {
      setFilteredTodos(todos); // 검색어가 없으면 원래 데이터 유지
    } else {
      const searchResults = await fetchSearchResults(newSearch);
      setFilteredTodos(searchResults); // 백엔드에서 가져온 검색 결과 반영
    }
  };

  // todos 값이 변경될 때 filteredTodos 업데이트
  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  // 통계 계산
  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.done).length;
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
          📆 오늘의 할 일 : {totalCount}개 ⭕ 완료 : {doneCount}개 ❌ 미완료 :
          {notDoneCount}개
        </div>
      </div>

      {/* 검색 입력 필드 */}
      <input
        value={search}
        onChange={onChangeSearch}
        placeholder="검색어를 입력하세요"
      />

      {/*  검색된 할 일 목록 표시 */}
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
