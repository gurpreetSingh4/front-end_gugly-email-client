import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClientProvider } from "./lib/ApolloClientProvider.tsx";

// Apply custom CSS for gradient text
const style = document.createElement('style');
style.textContent = `
  .gradient-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: linear-gradient(90deg, #3B82F6, #8B5CF6);
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .custom-shadow {
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.05);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <ApolloClientProvider>
  <App />
</ApolloClientProvider>
);
