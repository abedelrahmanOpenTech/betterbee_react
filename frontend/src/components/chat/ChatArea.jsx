import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { df } from "../../utils/lang";
import useAuth from "../../stores/useAuth";
import { useChatMessagesQuery, useSendMessage, useDeleteMessage, useHideMessage, useEditMessage, useChatUpdates } from "../../hooks/useChatQuery";
import Spinner from "../ui/Spinner";
import { uploadsUrl } from "../../config";
import toast from "react-hot-toast";
import { Fancybox } from "@fancyapps/ui";
import EmojiPicker from 'emoji-picker-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Custom toggle component for message options dropdown (React 19 ref prop).
 */
const MessageOptionsToggle = ({ onClick, ref }) => (
    <span
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className="cursor-pointer text-muted p-1 hover-opacity-100 opacity-50 d-flex align-items-center"
        style={{ fontSize: '0.8rem' }}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4a2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4a2 2 0 0 1 0-4" />
        </svg>
    </span>
);

export default function ChatArea({ otherUserId, onClose }) {
    const auth = useAuth();
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);

    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const searchInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const { data: chatData, isLoading } = useChatMessagesQuery(otherUserId);
    // Call useChatUpdates to poll for new messages, edits, and deletes
    useChatUpdates(otherUserId, auth?.user?.id);

    const { mutate: sendMessage, isPending: isSending } = useSendMessage();
    const { mutate: deleteMessage } = useDeleteMessage();
    const { mutate: hideMessage } = useHideMessage();
    const { mutate: editMessage } = useEditMessage();

    const otherUser = chatData?.otherUser;
    const messages = useMemo(() => chatData?.chat || [], [chatData]);

    /**
     * Scrolls the chat message container to the very bottom position.
     */
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    /**
     * Smoothly scrolls to a specific message element by its ID.
     */
    const scrollToMessage = (msgId) => {
        const el = document.getElementById(`message-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-warning-subtle');
            setTimeout(() => el.classList.remove('bg-warning-subtle'), 2000);
        }
    };

    /**
     * Closes the emoji picker when clicking outside of the component area.
     */
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setIsEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    /**
     * Handles initial scroll and manages external library bindings like Fancybox.
     */
    useEffect(() => {
        if (!isSearchOpen) {
            scrollToBottom();
        }
        Fancybox.bind("[data-fancybox]", {});
        return () => {
            Fancybox.destroy();
        };
    }, [chatData, otherUserId, isSearchOpen]);

    /**
     * Performs real-time message searching and updates matching results.
     */
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setCurrentResultIndex(0);
            return;
        }

        const results = messages.filter(msg =>
            msg.message && msg.message.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(msg => msg.id);

        setSearchResults(results);

        if (results.length > 0) {
            const lastIndex = results.length - 1;
            setCurrentResultIndex(lastIndex);
            scrollToMessage(results[lastIndex]);
        } else {
            setCurrentResultIndex(0);
        }

    }, [searchQuery, messages]);

    /**
     * Moves the search selection to the next matching message.
     */
    const handleNextResult = () => {
        if (searchResults.length === 0) return;
        const nextIndex = (currentResultIndex + 1) % searchResults.length;
        setCurrentResultIndex(nextIndex);
        scrollToMessage(searchResults[nextIndex]);
    };

    /**
     * Moves the search selection to the previous matching message.
     */
    const handlePrevResult = () => {
        if (searchResults.length === 0) return;
        const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
        setCurrentResultIndex(prevIndex);
        scrollToMessage(searchResults[prevIndex]);
    };

    /**
     * Toggles the message search bar and resets related states.
     */
    const toggleSearch = () => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setSearchQuery("");
            setSearchResults([]);
            scrollToBottom();
        } else {
            setIsSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    /**
     * Automatically focuses the text input when the component loads or searching ends.
     */
    useEffect(() => {
        if (!isLoading && textareaRef.current && !isSearchOpen && !replyingTo && !editingMessage) {
            textareaRef.current.focus();
        }
    }, [isLoading, otherUserId, isSearchOpen, replyingTo, editingMessage]);

    /**
     * Manages file selection and triggers uploads to the chat server.
     */
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setIsUploading(true);

            let uploadedCount = 0;
            let hasError = false;

            files.forEach((file) => {
                const formData = new FormData();
                formData.append('to_user_id', otherUserId);
                formData.append('chat_file', file);

                sendMessage(formData, {
                    onSuccess: () => {
                        uploadedCount++;
                        if (uploadedCount === files.length) {
                            setIsUploading(false);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            if (textareaRef.current) textareaRef.current.focus();
                        }
                    },
                    onError: (error) => {
                        if (!hasError) {
                            hasError = true;
                            toast.error(error.message ? error.message : df('error'));
                        }
                        uploadedCount++;
                        if (uploadedCount === files.length) {
                            setIsUploading(false);
                        }
                    }
                });
            });
        }
    };

    /**
     * Appends the selected emoji to the current message text.
     */
    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    /**
     * Initializes a reply to a specific message and focuses the input area.
     */
    const handleReply = (msg) => {
        setReplyingTo(msg);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleEdit = (msg) => {
        setEditingMessage(msg);
        setMessage(msg.message);
        setReplyingTo(null);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    /**
     * Sends the current message content to the backend.
     */
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (editingMessage) {
            editMessage({ messageId: editingMessage.id, message: message }, {
                onSuccess: () => {
                    setEditingMessage(null);
                    setMessage("");
                    setReplyingTo(null);
                    setIsEmojiPickerOpen(false);
                    if (textareaRef.current) textareaRef.current.focus();
                },
                onError: (error) => {
                    toast.error(error.message ? error.message : df('error'));
                }
            });
        } else {
            const formData = new FormData();
            formData.append('to_user_id', otherUserId);
            formData.append('message', message);
            if (replyingTo) {
                formData.append('reply_to', replyingTo.id);
            }

            sendMessage(formData, {
                onSuccess: () => {
                    setMessage("");
                    setReplyingTo(null);
                    setIsEmojiPickerOpen(false);
                    if (textareaRef.current) textareaRef.current.focus();
                },
                onError: (error) => {
                    toast.error(error.message ? error.message : df('error'));
                }
            });
        }
    };

    /**
     * Copies text content to the user's system clipboard.
     */
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(df('copied_to_clipboard'));
    };

    /**
     * Deletes a message from the current user's local view.
     */
    const handleDeleteForMe = async (messageId) => {
        const result = await MySwal.fire({
            title: df('are_you_sure'),
            text: df('confirm_delete_for_me'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: df('yes_delete'),
            cancelButtonText: df('cancel'),
            customClass: {
                confirmButton: 'btn btn-theme px-4 mx-2',
                cancelButton: 'btn btn-light px-4 mx-2'
            },
            buttonsStyling: false
        });

        if (!result.isConfirmed) return;

        hideMessage({ messageId }, {
            onSuccess: () => {
                toast.success(df('success'));
            },
            onError: () => {
                toast.error(df('error'));
            }
        });
    };

    /**
     * Deletes a message for all participants in the conversation.
     */
    const handleDeleteForEveryone = async (messageId) => {
        const result = await MySwal.fire({
            title: df('are_you_sure'),
            text: df('confirm_delete_for_everyone'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: df('yes_delete'),
            cancelButtonText: df('cancel'),
            customClass: {
                confirmButton: 'btn btn-theme px-4 mx-2',
                cancelButton: 'btn btn-light px-4 mx-2'
            },
            buttonsStyling: false
        });

        if (!result.isConfirmed) return;

        deleteMessage({ messageId }, {
            onSuccess: () => {
                toast.success(df('success'));
            },
            onError: () => {
                toast.error(df('error'));
            }
        });
    };

    /**
     * Identifies if a file is an image based on its extension.
     */
    const isImage = (filename) => {
        if (!filename) return false;
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
    };

    if (isLoading && !chatData) {
        return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-grey h-100">
                <Spinner />
            </div>
        );
    }

    const groupedMessages = messages.reduce((acc, msg) => {
        const date = new Date(msg.created_at);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateKey = date.toLocaleDateString();
        if (date.toDateString() === today.toDateString()) {
            dateKey = df('today');
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateKey = df('yesterday');
        }

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(msg);
        return acc;
    }, {});


    return (
        <div className="d-flex flex-column h-100 bg-light slide-up-animation position-relative">

            <div className="user-info d-flex justify-content-between px-2 align-items-center bg-theme text-white shadow-sm flex-shrink-0 z-9"
                style={{ height: '60px' }}>

                <div className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1">
                    <div role="button" onClick={onClose} className="d-block d-md-none me-2 flex-shrink-0">
                        <svg className="rtl-rotate" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12 24">
                            <path fill="#ddd" fillRule="evenodd"
                                d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z" />
                        </svg>
                    </div>

                    {!isSearchOpen ? (
                        <>
                            <div className={`profile-container flex-shrink-0 border border-3 rounded-circle position-relative ${otherUser?.is_online ? 'border-success' : ''}`} style={{ filter: otherUser?.is_online ? 'grayscale(0)' : 'grayscale(100%)' }}>
                                <img
                                    src={otherUser?.profile ? uploadsUrl + '/' + otherUser.profile : "https://ui-avatars.com/api/?name=" + otherUser?.name}
                                    alt={otherUser?.name}
                                    className="rounded-circle bg-white"
                                    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + otherUser?.name }}
                                />
                            </div>

                            <div className="text-truncate flex-grow-1">
                                <div className="fw-bold text-truncate">{otherUser?.name}</div>
                                <div className="small opacity-7500 text-truncate">{otherUser?.email}</div>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded px-2 py-1 slide-up-animation flex-grow-1" style={{ maxWidth: '100%' }}>
                            {searchResults.length > 0 && (
                                <div className="d-flex align-items-center gap-1 small text-nowrap">
                                    <span role="button" onClick={handlePrevResult} className="cursor-pointer p-1 hover-opacity-100 opacity-7500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path fill="#fff" fillRule="evenodd" d="M8 5.293l3.854 3.853l-.707.708L8 6.707L4.854 9.854l-.708-.708z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span>{searchResults.length > 0 ? currentResultIndex + 1 : 0}</span>
                                    <span className="opacity-50">/</span>
                                    <span>{searchResults.length}</span>
                                    <span role="button" onClick={handleNextResult} className="cursor-pointer p-1 hover-opacity-100 opacity-7500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path fill="none" stroke="#fff" d="M4.5 6L8 9.5L11.5 6" strokeWidth="2" />
                                        </svg>
                                    </span>
                                </div>
                            )}

                            <input
                                ref={searchInputRef}
                                type="text"
                                className="form-control form-control-sm bg-transparent border-0 border-bottom border-white shadow-none text-white"

                                placeholder={df('search') + "..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ minWidth: '50px' }}
                            />

                            <span role="button" onClick={toggleSearch} className="cursor-pointer hover-opacity-100 opacity-7500 ms-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#fff" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-3 align-items-center justify-content-end flex-shrink-0 ms-2">
                    {!isSearchOpen && (
                        <div role="button" onClick={toggleSearch} className="opacity-50 hover-opacity-100 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g fill="none">
                                    <path fill="currentColor" d="M19 11a8 8 0 1 1-16 0a8 8 0 0 1 16 0" opacity="0.5" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" />
                                </g>
                            </svg>
                        </div>
                    )}

                    {!isSearchOpen && (
                        <div role="button" onClick={onClose} className="d-none d-md-block opacity-50 hover-opacity-100 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22"
                                    opacity="0.5" />
                                <path fill="currentColor"
                                    d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 1 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-messages flex-grow-1 overflow-auto p-3" ref={chatContainerRef}>
                {messages.length === 0 && (
                    <div className="text-center my-auto p-5 animate-fade-in opacity-50">
                        {df('no_chats_message')}
                    </div>
                )}

                {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                        <div className="chat-date-divider opacity-7500">
                            <span>{date}</span>
                        </div>
                        {msgs.map((msg) => {
                            const isMine = msg.from_user_id === auth.user.id;
                            return (
                                <div key={msg.id} id={`message-${msg.id}`} className={`d-flex mb-3 ${isMine ? 'justify-content-start' : 'justify-content-end'} animate-fade-in`}>
                                    <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`} style={{ maxWidth: '75%', minWidth: '130px' }}>
                                        {msg.reply && (
                                            <div
                                                role="button"
                                                onClick={() => scrollToMessage(msg.reply.id)}
                                                className="reply-context p-2 mb-2 rounded bg-black bg-opacity-10 pointer border-start border-4 border-theme d-flex flex-column"
                                                style={{ fontSize: '0.85rem' }}
                                            >
                                                <div className="text-truncate small">@ {msg.reply.message}</div>
                                            </div>
                                        )}
                                        {msg.message && msg.message.trim() !== '' && (
                                            <div className="mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {msg.message}
                                                {msg.is_edited == 1 && (
                                                    <span className="ms-1 opacity-50 x-small" style={{ fontSize: '0.7rem' }}>({df('edited')})</span>
                                                )}
                                            </div>
                                        )}
                                        {msg.file && (
                                            <div className="mb-2 rounded text-dark overflow-hidden">
                                                {isImage(msg.file) ? (
                                                    <a href={uploadsUrl + '/' + msg.file} data-fancybox={`gallery-${otherUserId}`}>
                                                        <img
                                                            src={uploadsUrl + '/' + msg.file}
                                                            alt="Attachment"
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        />
                                                    </a>
                                                ) : (
                                                    <div className="p-2 bg-light rounded">
                                                        <a href={uploadsUrl + '/' + msg.file} target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center gap-2">
                                                            <span>📎</span> <span className="text-truncate">{msg.file}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className={`d-flex justify-content-between align-items-end ${isMine ? '' : 'flex-row-reverse'}`}>
                                            <div className={`small opacity-7500 fs-7 ${isMine ? 'text-white-50' : 'text-muted text-secondary'}`}>
                                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.created_at_diff}
                                                {isMine && (
                                                    <span className="ms-1 d-inline-flex align-items-center">
                                                        {msg.is_read ? (
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
                                            </div>

                                            <Dropdown drop={isMine ? "start" : "end"} className="ms-1">
                                                <Dropdown.Toggle as={MessageOptionsToggle} id={`msg-dropdown-${msg.id}`} />
                                                <Dropdown.Menu className="shadow-sm border-0 rounded-theme p-1" style={{ fontSize: '0.9rem', minWidth: '150px' }}>
                                                    <Dropdown.Item onClick={() => handleReply(msg)} className="py-2 rounded">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M10 9V5l-7 7l7 7v-4.1c5 0 8.5 1.6 11 5.1c-1-5-4-10-11-11" /></svg>
                                                            {df('reply')}
                                                        </div>
                                                    </Dropdown.Item>

                                                    {isMine && msg.message && (
                                                        <Dropdown.Item onClick={() => handleEdit(msg)} className="py-2 rounded">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                                                {df('edit')}
                                                            </div>
                                                        </Dropdown.Item>
                                                    )}

                                                    {msg.message && (
                                                        <Dropdown.Item onClick={() => handleCopy(msg.message)} className="py-2 rounded">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" /></svg>
                                                                {df('copy')}
                                                            </div>
                                                        </Dropdown.Item>
                                                    )}

                                                    <Dropdown.Item onClick={() => handleDeleteForMe(msg.id)} className="py-2 rounded">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" /></svg>
                                                            {df('delete_for_me')}
                                                        </div>
                                                    </Dropdown.Item>

                                                    {isMine && !msg.is_read && (
                                                        <Dropdown.Item onClick={() => handleDeleteForEveryone(msg.id)} className="py-2 rounded text-danger">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" /></svg>
                                                                {df('delete_for_everyone')}
                                                            </div>
                                                        </Dropdown.Item>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

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

                <div className="flex-grow-1 d-flex flex-column">
                    {replyingTo && (
                        <div className="reply-preview bg-light p-2 mb-1 rounded d-flex justify-content-between align-items-center animate-slide-in">
                            <div className="text-truncate small flex-grow-1 pe-2 border-start border-3 border-theme ps-2">
                                <div className="fw-bold x-small">{df('replying_to')}: {replyingTo.user?.name}</div>
                                <div className="text-truncate opacity-75">{replyingTo.message}</div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0 text-decoration-none shadow-none"
                                onClick={() => setReplyingTo(null)}
                            >
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
                    <textarea
                        ref={textareaRef}
                        className="form-control border-0 shadow-none px-0"
                        placeholder={df('type_message')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ height: '40px', resize: 'none', lineHeight: '25px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        autoFocus
                    ></textarea>
                </div>

                <button type="submit"
                    className="btn text-white shadow-sm ms-1 bg-theme rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                    disabled={isSending || !message.trim()}
                >
                    {isSending ? <div className="spinner-border spinner-border-sm text-white" role="status"></div> : (
                        <svg className="rtl-rotate" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                            <path fill="#fff" d="M256 277.333v-42.666H122.027L64 42.667L469.333 256L64 469.333l57.6-192z" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
