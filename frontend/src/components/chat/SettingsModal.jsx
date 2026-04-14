import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { df, getLang, changeLang } from "../../utils/lang";
import toast from "react-hot-toast";
import { hexToRgba, setTheme } from "../../utils/theme";
import useAuth from "../../stores/useAuth";
import { useSettingsUpdate } from "../../hooks/useAuthQuery";

export default function SettingsModal({ show, onClose }) {
    const auth = useAuth();
    const updateSettings = useSettingsUpdate();

    const [themeColor, setThemeColor] = useState(auth.user?.settings?.theme_color || localStorage.getItem('theme_color') || '#ffaa00');
    const [currentLang, setCurrentLang] = useState(getLang());

    useEffect(() => {
        if (show && auth.user?.settings) {
            setThemeColor(auth.user.settings.theme_color || '#ffaa00');
            setCurrentLang(auth.user.settings.lang || 'en');
        }
    }, [show, auth.user]);

    const handleSave = async () => {

        // 1. First, save to API
        const response = await updateSettings.mutateAsync({
            theme_color: themeColor,
            lang: currentLang
        });

        if (response.status !== 'success') {
            toast.error(response.message || 'Failed to update settings');
            return;
        }

        // Language change reload
        if (currentLang !== getLang()) {
            changeLang(currentLang); // Handles reload
            return;
        }

        toast.success(df('save_success'));
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered contentClassName="rounded-theme border-0 shadow">
            <Modal.Header closeButton className="bg-theme text-white border-0">
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
                            onChange={(e) => {
                                setThemeColor(e.target.value);
                                setTheme(e.target.value);
                            }}
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
