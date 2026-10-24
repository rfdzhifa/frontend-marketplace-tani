import { BrowserRouter } from "react-router";
import { AppProviders } from "./providers";
import { AppRouter } from "./router";

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
