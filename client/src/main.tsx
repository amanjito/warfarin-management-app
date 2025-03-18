import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePushNotifications } from "./lib/pushNotifications";

// Initialize push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    initializePushNotifications().catch(error => {
      console.error('Failed to initialize push notifications:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
