import { useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { df } from "../../../utils/lang";
import { formatTime, isImage, isArabic } from "../../../utils/utils";
import { FileIcon } from "../../../utils/chatUtils";

export default function ChatInputArea({
    message,
    setMessage,
    isUploading,
    isEmojiPickerOpen,
    setIsEmojiPickerOpen,
    selectedFiles,
    setSelectedFiles,
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
    handleFileSelect,
    handlePaste,
    onEmojiClick,
    handleSend,
    isSending,
    textareaRef,
    emojiPickerRef,
    fileInputRef
}) {
    return (
        <>
            {isEmojiPickerOpen && (
                <div ref={emojiPickerRef} className="position-absolute bottom-0 start-0 mb-5 ms-3 z-99 shadow-lg">
                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                </div>
            )}

            <form onSubmit={handleSend} className="border-top d-flex align-items-end p-2 bg-white">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="d-none"
                    id="chat_file_input"
                    multiple
                />
                <button
                    type="button"
                    className="btn btn-light me-1 rounded-circle p-2"
                    style={{ width: '40px', height: '40px' }}
                    title={df('attach_file')}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <div className="spinner-border spinner-border-sm text-theme" role="status"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13.324 8.436L9.495 12.19c-.364.36-.564.852-.556 1.369a2 2 0 0 0 .6 1.387c.375.371.88.584 1.403.593a1.92 1.92 0 0 0 1.386-.55l3.828-3.754a3.75 3.75 0 0 0 1.112-2.738a4 4 0 0 0-1.198-2.775a4.1 4.1 0 0 0-2.808-1.185a3.85 3.85 0 0 0-2.77 1.098L6.661 9.39a5.63 5.63 0 0 0-1.667 4.107a6 6 0 0 0 1.798 4.161a6.15 6.15 0 0 0 4.21 1.778a5.77 5.77 0 0 0 4.157-1.646l3.829-3.756" />
                        </svg>
                    )}
                </button>

                <button
                    type="button"
                    className="btn btn-light me-1 rounded-circle p-2 d-none d-md-block"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                </button>

                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                    {isRecording ? (
                        <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded w-100">
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
                            {replyingTo && (
                                <div className="reply-preview bg-light p-2 mb-1 rounded d-flex justify-content-between align-items-center animate-slide-in">
                                    <div className="text-truncate small flex-grow-1 pe-2 border-start border-3 border-theme ps-2">
                                        <div className="fw-bold x-small">{df('replying_to')}: {replyingTo.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none shadow-none"
                                        onClick={() => setReplyingTo(null)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg>
                                    </button>
                                </div>
                            )}
                            {editingMessage && (
                                <div className="reply-preview bg-light p-2 mb-1 rounded d-flex justify-content-between align-items-center animate-slide-in">
                                    <div className="text-truncate small flex-grow-1 pe-2 border-start border-3 border-warning ps-2">
                                        <div className="fw-bold x-small text-warning">{df('editing_message')}</div>
                                        <div className="text-truncate opacity-75">{editingMessage.message}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none shadow-none"
                                        onClick={() => {
                                            setEditingMessage(null);
                                            setMessage("");
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg>
                                    </button>
                                </div>
                            )}
                            <div className="selected-files-preview d-flex flex-wrap gap-3 px-3 ">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="position-relative mt-2">
                                        <div className="rounded border overflow-hidden shadow-sm" style={{ width: '60px', height: '60px' }}>
                                            {isImage(file.name) ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                                    <FileIcon filename={file.name} />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm rounded-circle position-absolute d-flex align-items-center justify-content-center shadow"
                                            style={{
                                                top: '-8px',
                                                right: '-8px',
                                                width: '22px',
                                                height: '22px',
                                                zIndex: 3,
                                                border: '2px solid white',
                                                padding: 0
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <textarea
                                ref={textareaRef}
                                onPaste={handlePaste}
                                className="form-control border-0 shadow-none px-0"
                                placeholder={df('type_message')}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                style={{
                                    height: '40px',
                                    resize: 'none',
                                    lineHeight: '25px',
                                    textAlign: !message ? null : (isArabic(message) ? 'right' : 'left'),
                                    direction: !message ? null : (isArabic(message) ? 'rtl' : 'ltr'),
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        event.preventDefault();
                                        handleSend(event);
                                    }
                                }}
                                autoFocus
                            ></textarea>
                        </>
                    )}
                </div>

                {!message.trim() && !isRecording && selectedFiles.length === 0 && (
                    <button
                        type="button"
                        className="btn btn-light ms-1 rounded-circle p-2"
                        style={{ width: '40px', height: '40px' }}
                        title={df('voice_record')}
                        onClick={startRecording}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                    </button>
                )}

                {(message.trim() || isRecording || selectedFiles.length > 0) && (
                    <button type={isRecording ? "button" : "submit"}
                        className={`btn text-white shadow-sm ms-1 ${isRecording ? 'bg-danger' : 'bg-theme'} rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 animate-scale-in`}
                        style={{ width: '40px', height: '40px' }}
                        disabled={(isSending || isUploading) && !isRecording}
                        onClick={isRecording ? stopRecording : undefined}
                    >
                        {isSending ? (
                            <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                        ) : isRecording ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            </svg>
                        ) : (
                            <svg className="rtl-rotate" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                                <path fill="#fff" d="M256 277.333v-42.666H122.027L64 42.667L469.333 256L64 469.333l57.6-192z" />
                            </svg>
                        )}
                    </button>
                )}
            </form>
        </>
    );
}
