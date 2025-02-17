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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const data = await response.json();

    // API 응답을 캐시에 저장
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

// 캐시 초기화 함수 (필요 시 사용)
export const clearCache = () => {
  Object.keys(cache).forEach((key) => delete cache[key]);
};
