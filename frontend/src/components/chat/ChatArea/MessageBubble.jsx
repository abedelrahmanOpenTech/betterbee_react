import { Dropdown } from "react-bootstrap";
import { df } from "../../../utils/lang";
import { uploadsUrl } from "../../../config";
import { basename, isImage, isAudio, isArabic } from "../../../utils/utils";
import Linkify from 'linkify-react';
import { MessageOptionsToggle, FileIcon } from "../../../utils/chatUtils";

export default function MessageBubble({
    message,
    isMine,
    otherUserId,
    scrollToMessage,
    handleReply,
    onForward,
    handleEdit,
    handleCopy,
    handleDeleteForMe,
    handleDeleteForEveryone,
    setSelectedMessageForTask,
    setShowAddToProject
}) {
    return (
        <div id={`message-${message.id}`} className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`} style={{ maxWidth: '75%', minWidth: '130px' }}>
                {message.reply && (
                    <div
                        role="button"
                        onClick={() => scrollToMessage(message.reply.id)}
                        className="reply-context p-2 mb-2 rounded bg-black bg-opacity-10 pointer border-start border-4 border-theme d-flex flex-column"
                        style={{ fontSize: '0.85rem' }}
                    >
                        <div className="text-truncate small">@ {message.reply.message}</div>
                    </div>
                )}
                {message.file && (
                    <div className="mb-2 rounded text-dark overflow-hidden">
                        {isImage(message.file) ? (
                            <div className="position-relative">
                                <a href={uploadsUrl + '/' + message.file} data-fancybox={`gallery-${otherUserId}`}>
                                    <img
                                        src={uploadsUrl + '/' + message.file}
                                        alt="Attachment"
                                        className="img-fluid rounded"
                                        style={{ height: '100px', objectFit: 'cover' }}
                                    />
                                </a>
                                <a
                                    href={uploadsUrl + '/' + message.file}
                                    download={basename(message.file)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-theme rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm position-absolute top-0 end-0 m-1"
                                    style={{ width: '28px', height: '28px', border: '1px solid rgba(255,255,255,0.2)' }}
                                    title={df('download')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        ) : isAudio(message.file) ? (
                            <div className="audio-player-container py-1">
                                <audio
                                    controls
                                    className="w-100 custom-audio-player"
                                    style={{ height: '35px' }}
                                    src={uploadsUrl + '/' + message.file}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ) : (
                            <div className="p-3 bg-white bg-opacity-75 rounded d-flex align-items-center justify-content-between gap-3 shadow-sm border" style={{ minWidth: '220px' }}>
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                    <div className="flex-shrink-0">
                                        <FileIcon filename={message.file} />
                                    </div>
                                    <div className="text-truncate flex-grow-1">
                                        <div className="fw-bold small text-truncate text-dark">{basename(message.file)}</div>
                                    </div>
                                </div>
                                <a
                                    href={uploadsUrl + '/' + message.file}
                                    download={basename(message.file)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-theme rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                                    style={{ width: '32px', height: '32px' }}
                                    title={df('download')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                )}
                {message.message && message.message.trim() !== '' && (
                    <div className="mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', direction: isArabic(message.message) ? 'rtl' : 'ltr', textAlign: isArabic(message.message) ? 'right' : 'left' }}>
                        <Linkify options={{ target: '_blank' }}>
                            {message.message}
                        </Linkify>
                        {message.is_edited == 1 && (
                            <span className="d-block opacity-75 x-small" style={{ fontSize: '0.7rem' }}>({df('edited')})</span>
                        )}
                    </div>
                )}

                <bdi className={`d-flex justify-content-end align-items-center`}>
                    <div className={`d-flex align-items-center gap-2 small fs-7 ${isMine ? 'text-white opacity-75' : 'text-muted text-secondary'}`}>
                        {isMine && (
                            <span className="ms-1 d-inline-flex align-items-center">
                                {message.is_read ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6L7 17l-5-5" />
                                        <path d="m22 10-7.5 7.5L13 16" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                            </span>
                        )}

                        {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : message.created_at_diff}
                    </div>

                    <Dropdown drop={isMine ? "start" : "end"} className="ms-1">
                        <Dropdown.Toggle as={MessageOptionsToggle} />
                        <Dropdown.Menu className="shadow-sm border-0 rounded-theme p-1" style={{ fontSize: '0.9rem', minWidth: '150px' }}>
                            <Dropdown.Item onClick={() => handleReply(message)} className="py-2 rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M10 9V5l-7 7l7 7v-4.1c5 0 8.5 1.6 11 5.1c-1-5-4-10-11-11" /></svg>
                                    {df('reply')}
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => onForward(message)} className="py-2 rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4.5 9.5H9V17H15V9.5H19.5L12 2Z" /></svg>
                                    {df('forward')}
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => {
                                setSelectedMessageForTask(message);
                                setShowAddToProject(true);
                            }} className="py-2 rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    {df('add_as_task')}
                                </div>
                            </Dropdown.Item>

                            {isMine && message.message && (
                                <Dropdown.Item onClick={() => handleEdit(message)} className="py-2 rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                        {df('edit')}
                                    </div>
                                </Dropdown.Item>
                            )}

                            {message.message && (
                                <Dropdown.Item onClick={() => handleCopy(message.message)} className="py-2 rounded">
                                    <div className="d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" /></svg>
                                        {df('copy')}
                                    </div>
                                </Dropdown.Item>
                            )}

                            <Dropdown.Item onClick={() => handleDeleteForMe(message.id)} className="py-2 rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" /></svg>
                                    {df('delete_for_me')}
                                </div>
                            </Dropdown.Item>

                            {isMine && !message.is_read && (
                                <Dropdown.Item onClick={() => handleDeleteForEveryone(message.id)} className="py-2 rounded text-danger">
                                    <div className="d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" /></svg>
                                        {df('delete_for_everyone')}
                                    </div>
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </bdi>
            </div>
        </div>
    );
}
