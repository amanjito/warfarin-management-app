import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePushNotifications } from "./lib/pushNotifications";
import { AuthProvider } from "./lib/authContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Initialize push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    initializePushNotifications().catch(error => {
      console.error('Failed to initialize push notifications:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
