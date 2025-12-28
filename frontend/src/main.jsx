import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import './assets/css/main.css'
import App from './pages/App.jsx'
import ReactDOM from "react-dom/client";
import { initLocalization } from './utils/lang.js';
import { initTheme } from './utils/theme.js';

initLocalization();
initTheme();

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
