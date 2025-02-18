const BASE_URL = "http://localhost:8080/api";

const cache = {}; // API 응답을 저장하는 캐시 객체

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const cacheKey = `${method}:${endpoint}`;

  // 같은 요청이 있으면 캐시된 응답 반환
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    // 응답이 JSON인지 확인하고 처리
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      cache[cacheKey] = data; // 캐시에 저장
      return data;
    } else {
      return await response.text(); //  일반 텍스트 응답 처리
    }
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

// 캐시 초기화 함수 (필요 시 사용)
export const clearCache = () => {
  Object.keys(cache).forEach((key) => delete cache[key]);
};

export const checkSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("세션이 만료되었거나 로그인되지 않았습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("세션 확인 오류:", error);
    return null;
  }
};
export const fetchTodosByDate = async (date) => {
  try {
    console.log(`📡 요청 보내는 중: /todos/date?date=${date}`);

    const response = await fetch(
      `${BASE_URL}/todos/date?date=${encodeURIComponent(date)}`, //
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 요청 실패: ${errorText}`);
      throw new Error(
        `TODO 데이터를 불러오는데 실패했습니다. 서버 응답: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(" 받은 데이터:", data);
    return data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    return [];
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await fetch(`http://localhost:8080/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error("TODO 추가 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("TODO 추가 오류:", error);
    return null;
  }
};
