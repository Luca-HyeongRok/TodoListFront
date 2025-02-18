import AppRouter from "./routes/AppRouter";
import { TodoProvider } from "./context/TodoContext"; // TodoProvider 추가

function App() {
  return (
    <TodoProvider>
      <AppRouter />
    </TodoProvider>
  );
}

export default App;
