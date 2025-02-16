import "./Home.css";
import { BASE_URL } from "../config";
import {
  useState,
  useRef,
  useReducer,
  useCallback,
  createContext,
  useMemo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Editor from "../components/Editor";
import List from "../components/List";
import Footer from "../components/Footer";

// 로그인 상태 확인 API
const checkSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/session`, {
      method: "GET",
      credentials: "include", // 세션 유지
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

// 할 일 목록 가져오기(userId를 통한)
const fetchTodos = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.userId) {
    console.error("fetchTodos: userId가 없습니다.");
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/todos/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 세션 유지
      body: JSON.stringify({ userId: user.userId }), // userId를 포함하여 보냄
    });

    if (!response.ok) {
      throw new Error("할 일 목록을 불러오는 데 실패했습니다.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("할 일 목록 불러오기 오류:", error);
    return [];
  }
};

//Context API
export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

//Reducer 정의
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
      return action.data || []; // `null` 방지
    default:
      return state;
  }
}

function Home() {
  const [todos, dispatch] = useReducer(reducer, []);
  const navigate = useNavigate();
  //const listIdRef = useRef(1);

  //세션 확인 후 로그인 유지
  useEffect(() => {
    const checkLogin = async () => {
      const user = await checkSession();
      if (!user) {
        navigate("/"); // 로그인 페이지로 이동
      }
    };
    checkLogin();
  }, []);

  // API로부터 데이터 받아오기
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTodos();
      dispatch({ type: "SET_TODOS", data });
    };
    loadData();
  }, []);

  const onCreate = useCallback(
    async (content, priority, startDate, endDate) => {
      try {
        const response = await fetch(`${BASE_URL}/todos`, {
          method: "POST",
          body: JSON.stringify({
            content,
            priority,
            startDate,
            endDate,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔥 세션 유지 필수
        });

        if (!response.ok) {
          throw new Error(`할 일 추가 실패 (status: ${response.status})`);
        }

        console.log("할 일 추가 성공!");

        const updatedData = await fetchTodos();
        dispatch({ type: "SET_TODOS", data: updatedData });
      } catch (error) {
        console.error("할 일 추가 중 오류 발생:", error);
      }
    },
    []
  );

  const onChange = useCallback(
    async (listId, newIsDone) => {
      console.log("Updating Todo with id:", listId, "newIsDone:", newIsDone);

      // 상태를 먼저 업데이트
      dispatch({
        type: "UPDATE",
        targetId: listId,
        newIsDone: newIsDone,
      });

      const targetTodo = todos.find((todo) => todo.listId === listId);
      if (targetTodo) {
        try {
          const response = await fetch(
            `%{BASE_URL}/todos/${listId}`, // 백틱으로 수정
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                listId, // listId는 유지
                content: targetTodo.content,
                priority: targetTodo.priority,
                startDate: targetTodo.startDate,
                endDate: targetTodo.endDate,
                done: newIsDone, // 체크박스 상태태
              }),
            }
          );

          if (!response.ok) {
            console.error("Server responded with status:", response.status);
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`Error updating todo: ${response.statusText}`);
          }

          console.log("Update request successful");
        } catch (error) {
          console.error("Error updating todo:", error);
        }
      }
    },
    [todos]
  );

  const onEdit = useCallback(
    async (listId, newContent, newPriority, newStartDate, newEndDate) => {
      if (!listId) {
        console.error("수정할 Todo ID가 유효하지 않습니다:", listId);
        return;
      }

      console.log("수정할 ID 체크 :", listId);

      // 1. 프론트엔드 상태 먼저 업데이트 (Optimistic UI 적용)
      dispatch({
        type: "EDIT",
        targetId: listId,
        newContent,
        newPriority,
        newStartDate,
        newEndDate,
      });

      try {
        // 2. 백엔드 업데이트 요청
        const response = await fetch(`${BASE_URL}/todos/edit/${listId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            listId,
            content: newContent,
            priority: newPriority,
            startDate: newStartDate,
            endDate: newEndDate,
          }),
        });

        if (!response.ok) {
          throw new Error("수정 실패");
        }

        console.log("수정 성공:", listId);

        // 3. 서버에서 최신 데이터 가져와 상태 업데이트
        const updatedData = await fetchTodos();
        dispatch({ type: "SET_TODOS", data: updatedData });
      } catch (error) {
        console.error("수정 중 오류 발생:", error);
      }
    },
    []
  );

  const onDelete = useCallback(
    async (listId) => {
      // console.log("삭제할 ID 체크 : ", listId); // 삭제하려는 항목의 ID를 로그로 출력 (디버깅용)

      // 1. 프론트엔드 상태 먼저 업데이트 (옵티미스틱 UI)
      dispatch({
        type: "DELETE",
        targetId: listId,
      });

      try {
        // 백에 delete요청
        const response = await fetch(`${BASE_URL}/todos/${listId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("삭제 실패");
        }

        console.log("삭제 성공 :", listId);

        // 3. 백엔드에서 삭제가 성공했을 때, 상태를 다시 업데이트하는 코드
        const data = await fetchTodos();

        dispatch({
          type: "SET_TODOS",
          data,
        });
      } catch (error) {
        // 오류 발생 시 롤백
        console.error("삭제 중 오류 발생:", error); // 에러 메시지 출력

        // 롤백 처리: 실패 시 다시 원래 상태로 복구
        dispatch({
          type: "CREATE",
          data: todos.find((todo) => todo.listId === listId), // 삭제하려던 항목을 다시 추가
        });
      }
    },
    [dispatch, todos] // todos 상태와 dispatch를 의존성으로 추가
  );

  // const memoizedDispatch = { onCreate, onUpdate, onDelete };
  // memoizedDispatch 객체 생성 방식 수정
  const memoizedDispatch = useMemo(
    () => ({
      onCreate,
      onChange,
      onDelete,
      onEdit,
    }),
    [onCreate, onChange, onDelete, onEdit]
  );

  // 중요도 순으로 정렬 후, 중요도가 같으면 가나다순으로 정렬
  const sortedTodos = useMemo(() => {
    console.log("sortedTodos:", todos);
    return [...todos].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.content.localeCompare(b.content);
    });
  }, [todos]);

  return (
    <div className="home-container">
      <Header />
      <TodoStateContext.Provider value={sortedTodos}>
        <TodoDispatchContext.Provider value={memoizedDispatch}>
          <div className="main-content">
            <Editor />
            <List />
          </div>
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
      <Footer />
    </div>
  );
}

export default Home;
