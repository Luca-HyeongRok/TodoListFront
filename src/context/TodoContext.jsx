import { createContext, useReducer, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { fetchTodosByDate } from "../utils/api";

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.data || [] };

    case "CREATE":
      apiRequest("/todos", "POST", action.data);
      return { ...state, todos: [...state.todos, action.data] };

    case "UPDATE":
      apiRequest(`/todos/${action.targetId}`, "PATCH", {
        done: action.newIsDone,
      });
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.listId === action.targetId
            ? { ...item, done: action.newIsDone }
            : item
        ),
      };

    case "DELETE":
      apiRequest(`/todos/${action.targetId}`, "DELETE");
      return {
        ...state,
        todos: state.todos.filter((item) => item.listId !== action.targetId),
      };

    case "EDIT":
      apiRequest(`/todos/edit/${action.targetId}`, "PATCH", {
        content: action.newContent,
        priority: action.newPriority,
        startDate: action.newStartDate,
        endDate: action.newEndDate,
      });
      return {
        ...state,
        todos: state.todos.map((item) =>
          item.listId === action.targetId
            ? {
                ...item,
                content: action.newContent,
                priority: action.newPriority,
                startDate: action.newStartDate,
                endDate: action.newEndDate,
              }
            : item
        ),
      };

    case "CHANGE_DATE":
      return { ...state, selectedDate: action.date };

    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    todos: [],
    selectedDate: new Date(),
  });

  useEffect(() => {
    const fetchTodos = async () => {
      if (!state.selectedDate) return;

      const formattedDate = state.selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
      console.log("📅 API 요청: ", formattedDate); // 디버깅용 콘솔 출력

      const data = await fetchTodosByDate(formattedDate); // 정렬 추가
      dispatch({ type: "SET_TODOS", data });
    };

    fetchTodos();
  }, [state.selectedDate]); // selectedDate가 변경될 때만 실행

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};
