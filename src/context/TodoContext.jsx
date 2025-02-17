import { createContext, useReducer, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

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

    case "CHANGE_DATE": //  날짜 변경 시 API 호출
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
    const fetchTodosByDate = async () => {
      const formattedDate = state.selectedDate.toISOString().split("T")[0];
      const data = await apiRequest(`/todos/date?date=${formattedDate}`);
      dispatch({ type: "SET_TODOS", data });
    };

    fetchTodosByDate();
  }, [state.selectedDate]); // selectedDate가 변경될 때만 실행

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};
