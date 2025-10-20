
  import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppWithApi from "./AppWithApi.tsx";
import { ApiProvider } from "./contexts/ApiContext";
import "./index.css";

// Use the original App for localStorage version
// Uncomment the lines below to use the API-integrated version
// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <ApiProvider>
//       <AppWithApi />
//     </ApiProvider>
//   </React.StrictMode>
// );

// Original localStorage version
createRoot(document.getElementById("root")!).render(<App />);
  