import { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { df } from "../../utils/lang";
import { uploadsUrl } from "../../config";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { useSendBroadcast } from "../../hooks/useChatQuery";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { formatTime } from "../../utils/utils";

export default function BroadcastModal({ show, onClose, users, initialMessage = "", forwardFile = null, title = null }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFile, setExistingFile] = useState(null);
    const [selectAll, setSelectAll] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const { mutate: sendBroadcast, isPending: isSending } = useSendBroadcast();

    const handleAudioStop = (audioFile) => {
        setSelectedFile(audioFile);
        toast.success(df('voice_recorded'));
    };

    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording
    } = useAudioRecorder(handleAudioStop);

    useEffect(() => {
        if (show) {
            const isForward = !!(initialMessage || forwardFile);
            if (users.length > 0 && !isForward) {
                setSelectedUsers(users.map(user => user.id));
                setSelectAll(true);
            } else {
                setSelectedUsers([]);
                setSelectAll(false);
            }
            setSearchTerm("");
            setMessage(initialMessage || "");
            setExistingFile(forwardFile);
            setSelectedFile(null);
        }
    }, [show, users, initialMessage, forwardFile]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
        setSelectAll(!selectAll);
    };

    const handleUserToggle = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSend = (event) => {
        event.preventDefault();

        if (selectedUsers.length === 0) {
            toast.error(df('select_at_least_one_user'));
            return;
        }

        if (!message.trim() && !selectedFile && !existingFile) {
            toast.error(df('message_or_file_required'));
            return;
        }

        const formData = new FormData();
        formData.append('user_ids', JSON.stringify(selectedUsers));
        if (message.trim()) {
            formData.append('message', message);
        }
        if (selectedFile) {
            formData.append('chat_file', selectedFile);
        } else if (existingFile) {
            formData.append('forward_file', existingFile);
        }

        sendBroadcast(formData, {
            onSuccess: () => {
                toast.success(df('broadcast_sent'));
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message || df('error'));
            }
        });
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setMessage("");
        setSelectedFile(null);
        setExistingFile(null);
        setSelectAll(true);
        setSearchTerm("");
        if (isRecording) {
            cancelRecording();
        }
        onClose();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setExistingFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="rounded-theme border-0 shadow">
            <Modal.Header closeButton className="bg-theme text-white border-0">
                <Modal.Title className="fw-bold">{title || df('broadcast_message')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="p-3">
                    <div className="d-flex flex-column gap-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <h6 className="mb-0">{df('select_recipients')}</h6>
                                {selectedUsers.length > 0 && (
                                    <div className="small text-secondary">
                                        {selectedUsers.length} {df('users_selected')}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-3">

                                <div className="d-flex align-items-center gap-2 mb-0">
                                    <label className="form-check-label pointer user-select-none" htmlFor="select_all">
                                        {df('select_all')}
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="select_all"
                                        className="form-check-input pointer shadow-none mt-0"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 shadow-none ps-0"
                                placeholder={df('search')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="bg-white overflow-auto mb-3" style={{ maxHeight: '400px' }}>
                        {filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-secondary">
                                {searchTerm ? df('no_results') : df('no_users_available')}
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="d-flex align-items-center justify-content-between p-2 hover-bg-light"
                                    role="button"
                                    onClick={() => handleUserToggle(user.id)}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <img
                                            src={user.profile ? uploadsUrl + '/' + user.profile : "https://ui-avatars.com/api/?name=" + user.name}
                                            alt={user.name}
                                            className="rounded-circle"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            onError={(event) => { event.target.src = "https://ui-avatars.com/api/?name=" + user.name }}
                                        />
                                        <div>
                                            <div className="fw-bold">{user.name}</div>
                                            <div className="small text-secondary">{user.email}</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="form-check-input pointer shadow-none"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserToggle(user.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                </div>

                <div className="p-3">
                    <form onSubmit={handleSend}>
                        {isRecording ? (
                            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="recording-dot bg-danger rounded-circle pulse-animation" style={{ width: '10px', height: '10px' }}></div>
                                    <span className="small fw-bold text-danger">{df('recording')} {formatTime(recordingTime)}</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link text-danger p-0 text-decoration-none shadow-none fw-bold"
                                    onClick={cancelRecording}
                                >
                                    {df('cancel')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">{df('message')}</label>
                                    <textarea
                                        className="form-control shadow-none"
                                        ref={textareaRef}
                                        rows={4}
                                        placeholder={df('type_message')}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={isSending}
                                    />
                                </div>

                                {(selectedFile || existingFile) && (
                                    <div className="mb-3 p-3 bg-light rounded d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                                <path d="M13.324 8.436L9.495 12.19c-.364.36-.564.852-.556 1.369a2 2 0 0 0 .6 1.387c.375.371.88.584 1.403.593a1.92 1.92 0 0 0 1.386-.55l3.828-3.754a3.75 3.75 0 0 0 1.112-2.738a4 4 0 0 0-1.198-2.775a4.1 4.1 0 0 0-2.808-1.185a3.85 3.85 0 0 0-2.77 1.098L6.661 9.39a5.63 5.63 0 0 0-1.667 4.107a6 6 0 0 0 1.798 4.161a6.15 6.15 0 0 0 4.21 1.778a5.77 5.77 0 0 0 4.157-1.646l3.829-3.756" />
                                            </svg>
                                            <span className="small text-truncate pulse-animation-hover">
                                                {selectedFile ? selectedFile.name : (existingFile.split('/').pop())}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-danger p-0 ms-2 flex-shrink-0"
                                            onClick={removeFile}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <div className="d-flex gap-2 mb-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="d-none"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-theme rounded-theme px-3"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSending || selectedFile}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                            <path d="M13.324 8.436L9.495 12.19c-.364.36-.564.852-.556 1.369a2 2 0 0 0 .6 1.387c.375.371.88.584 1.403.593a1.92 1.92 0 0 0 1.386-.55l3.828-3.754a3.75 3.75 0 0 0 1.112-2.738a4 4 0 0 0-1.198-2.775a4.1 4.1 0 0 0-2.808-1.185a3.85 3.85 0 0 0-2.77 1.098L6.661 9.39a5.63 5.63 0 0 0-1.667 4.107a6 6 0 0 0 1.798 4.161a6.15 6.15 0 0 0 4.21 1.778a5.77 5.77 0 0 0 4.157-1.646l3.829-3.756" />
                                        </svg>
                                        {df('attach_file')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-theme rounded-theme px-3"
                                        onClick={startRecording}
                                        disabled={isSending || selectedFile || existingFile}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="22" />
                                        </svg>
                                        {df('record_voice')}
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="d-flex gap-2 justify-content-end">
                            {isRecording ? (
                                <button
                                    type="button"
                                    className="btn btn-danger rounded-theme"
                                    onClick={stopRecording}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    </svg>
                                    {df('stop_recording')}
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-theme px-4"
                                        onClick={handleClose}
                                        disabled={isSending}
                                    >
                                        {df('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-theme rounded-theme px-4 btn-theme"
                                        disabled={isSending || selectedUsers.length === 0 || (!message.trim() && !selectedFile && !existingFile)}
                                    >
                                        {isSending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                {df('sending')}
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" className="me-1 rtl-rotate">
                                                    <path fill="currentColor" d="M256 277.333v-42.666H122.027L64 42.667L469.333 256L64 469.333l57.6-192z" />
                                                </svg>
                                                {df('send_broadcast')}
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
