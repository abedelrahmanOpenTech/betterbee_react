import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import './assets/css/main.css'
import App from './pages/App.jsx'
import ReactDOM from "react-dom/client";
import { initLocalization } from './utils/lang.js';
import { initTheme } from './utils/theme.js';
import { saveServiceWorkerRegistration } from './utils/notification.js';

initLocalization();
initTheme();

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(import.meta.env.VITE_ROOT_PATH + 'sw.js?v=2')
            .then(registration => {
                saveServiceWorkerRegistration(registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
