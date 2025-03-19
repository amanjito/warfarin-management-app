import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializePushNotifications } from "./lib/pushNotifications";
import { useEffect } from "react";
import { ThemeProvider } from "./components/theme/theme-provider";

// Set document direction and language
document.documentElement.dir = "rtl";
document.documentElement.lang = "fa";

// Add custom install prompt for PWA (for non-standard browsers)
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Optionally, show your own install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, discard it
        deferredPrompt = null;
        // Hide the install button
        installButton.style.display = 'none';
      }
    });
  }
});

// Display a message when the app is installed
window.addEventListener('appinstalled', (evt) => {
  console.log('Application successfully installed!');
});

// Initialize push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    initializePushNotifications().catch(error => {
      console.error('Failed to initialize push notifications:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <App />
  </ThemeProvider>
);
