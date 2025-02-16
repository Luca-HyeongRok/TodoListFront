import "./Home.css";
import { BASE_URL } from "../config";
import {
  useState,
  useReducer,
  useEffect,
  useCallback,
  createContext,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Editor from "../components/Editor";
import List from "../components/List";
import Footer from "../components/Footer";

// 날짜 변경시 할 일 목록 가져오기
const fetchTodosByDate = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/todos/date?date=${date}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("해당 날짜의 할 일 목록을 불러오는 데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("할 일 목록 불러오기 오류:", error);
    return [];
  }
};

// 로그인 상태 확인
const checkSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("세션이 만료되었거나 로그인되지 않음");
      return null;
    }

    const userData = await response.json();
    localStorage.setItem("user", JSON.stringify(userData)); // 세션 데이터 저장
    return userData;
  } catch (error) {
    console.error("세션 확인 중 오류 발생:", error);
    return null;
  }
};

// Context API
export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

// Reducer 정의
function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [...state, action.data];
    case "UPDATE":
      return state.map((item) =>
        item.listId === action.targetId
          ? { ...item, done: action.newIsDone }
          : item
      );
    case "DELETE":
      return state.filter((item) => item.listId !== action.targetId);
    case "EDIT":
      return state.map((item) =>
        item.listId === action.targetId
          ? {
              ...item,
              content: action.newContent,
              priority: action.newPriority,
              startDate: action.newStartDate,
              endDate: action.newEndDate,
            }
          : item
      );
    case "SET_TODOS":
      return action.data || [];
    default:
      return state;
  }
}

function Home() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // 특정 날짜의 할 일 목록 불러오기
  const loadTodosByDate = useCallback(async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const filteredTodos = await fetchTodosByDate(formattedDate);
    dispatch({ type: "SET_TODOS", data: filteredTodos });
  }, []);

  // 날짜 변경 함수 (이전 날짜 or 선택한 날짜 반영)
  const moveDate = (direction, date = null) => {
    const newDate = date ? new Date(date) : new Date(selectedDate);
    if (!date) {
      newDate.setDate(newDate.getDate() + direction);
    }
    setSelectedDate(newDate); // 상태 업데이트
    loadTodosByDate(newDate); // 해당 날짜의 할 일 목록 불러오기
  };

  // 할 일 추가
  const onCreate = useCallback(
    async (content, priority, startDate, endDate) => {
      try {
        const response = await fetch(`${BASE_URL}/todos`, {
          method: "POST",
          body: JSON.stringify({ content, priority, startDate, endDate }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("할 일 추가 실패");
        }

        loadTodosByDate(selectedDate);
      } catch (error) {
        console.error("할 일 추가 중 오류 발생:", error);
      }
    },
    [selectedDate, loadTodosByDate]
  );

  // 할 일 완료 상태 변경
  const onChange = useCallback(
    async (listId, newIsDone) => {
      try {
        const response = await fetch(`${BASE_URL}/todos/${listId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: newIsDone }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("할 일 상태 변경 실패");
        }

        dispatch({ type: "UPDATE", targetId: listId, newIsDone });
      } catch (error) {
        console.error("할 일 상태 변경 중 오류 발생:", error);
      }
    },
    [dispatch]
  );

  // 할 일 수정
  const onEdit = useCallback(
    async (listId, newContent, newPriority, newStartDate, newEndDate) => {
      try {
        const response = await fetch(`${BASE_URL}/todos/edit/${listId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newContent,
            priority: newPriority,
            startDate: newStartDate,
            endDate: newEndDate,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("할 일 수정 실패");
        }

        loadTodosByDate(selectedDate);
      } catch (error) {
        console.error("할 일 수정 중 오류 발생:", error);
      }
    },
    [selectedDate, loadTodosByDate]
  );

  //  할 일 삭제
  const onDelete = useCallback(
    async (listId) => {
      try {
        const response = await fetch(`${BASE_URL}/todos/${listId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("할 일 삭제 실패");
        }

        loadTodosByDate(selectedDate);
      } catch (error) {
        console.error("할 일 삭제 중 오류 발생:", error);
      }
    },
    [selectedDate, loadTodosByDate]
  );

  // 세션 확인 후 로그인 유지
  useEffect(() => {
    const checkLogin = async () => {
      const user = await checkSession();
      if (!user) {
        navigate("/"); // 로그인 페이지로 이동
      }
    };
    checkLogin();
  }, [navigate]);

  // 페이지 로드 시 현재 날짜의 할 일 목록 불러오기
  useEffect(() => {
    loadTodosByDate(selectedDate);
  }, [selectedDate, loadTodosByDate]);

  // Dispatch Context Memoization
  const memoizedDispatch = useMemo(
    () => ({
      onCreate,
      onChange,
      onDelete,
      onEdit,
    }),
    [onCreate, onChange, onDelete, onEdit]
  );

  return (
    <div className="home-container">
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        moveDate={moveDate}
      />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider value={memoizedDispatch}>
          <div className="main-content">
            <Editor selectedDate={selectedDate} />
            <List />
          </div>
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
      <Footer />
    </div>
  );
}

export default Home;
