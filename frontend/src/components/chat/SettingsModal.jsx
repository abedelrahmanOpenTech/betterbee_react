import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { df, getLang, changeLang } from "../../utils/lang";
import toast from "react-hot-toast";
import { hexToRgba } from "../../utils/theme";

export default function SettingsModal({ show, onClose }) {
    const [themeColor, setThemeColor] = useState(localStorage.getItem('theme_color') || '#ffaa00');
    const [currentLang, setCurrentLang] = useState(getLang());

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme_color');
        if (currentTheme) {
            setThemeColor(currentTheme);
        }
    }, [show]);

    const handleSave = () => {
        // Save Theme
        localStorage.setItem('theme_color', themeColor);
        document.documentElement.style.setProperty('--theme-color', themeColor);
        document.documentElement.style.setProperty('--theme-color-light', hexToRgba(themeColor));

        // Save Language (Reloads page)
        if (currentLang !== getLang()) {
            changeLang(currentLang);
            // changeLang triggers reload, so we don't need to do anything else (like toast) effectively
            return;
        }

        toast.success(df('save_success'));
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered contentClassName="rounded-theme border-0 shadow">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{df('settings')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Theme Color */}
                <div className="mb-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">{df('theme_color')}</label>
                    <div className="d-flex gap-3 align-items-center">
                        <input
                            type="color"
                            className="form-control form-control-color border-0 p-0 overflow-hidden cursor-pointer"
                            style={{ width: '60px', height: '60px', borderRadius: '12px' }}
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                        />
                        <span className="text-secondary fw-medium">{themeColor.toUpperCase()}</span>
                    </div>
                    <p className="small text-secondary mt-2 mb-0">
                        {df('choose_color_desc')}
                    </p>
                </div>

                {/* Language */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">{df('language')}</label>
                    <div className="d-flex gap-2">
                        <button
                            className={`btn flex-grow-1 ${currentLang === 'en' ? 'btn-theme' : 'btn-light border'} rounded-theme`}
                            onClick={() => setCurrentLang('en')}
                        >
                            English
                        </button>
                        <button
                            className={`btn flex-grow-1 ${currentLang === 'ar' ? 'btn-theme' : 'btn-light border'} rounded-theme`}
                            onClick={() => setCurrentLang('ar')}
                        >
                            العربية
                        </button>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" className="rounded-theme px-4" onClick={onClose}>
                    {df('cancel')}
                </Button>
                <Button variant="theme" className="btn-theme rounded-theme px-4" onClick={handleSave}>
                    {df('save')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
