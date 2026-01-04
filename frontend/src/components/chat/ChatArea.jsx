import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { df } from "../../utils/lang";
import useAuth from "../../stores/useAuth";
import { useChatMessages, useSendMessage, useDeleteMessage, useHideMessage, useEditMessage, useChatUpdates, useSendPushNotification } from "../../hooks/useChatQuery";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import Spinner from "../ui/Spinner";
import { uploadsUrl } from "../../config";
import toast from "react-hot-toast";
import { Fancybox } from "@fancyapps/ui";
import EmojiPicker from 'emoji-picker-react';
import { basename, formatTime, isImage, isAudio, isLink, ensureProtocol } from "../../utils/utils";
import { MySwal, MessageOptionsToggle, FileIcon } from "../../utils/chatUtils";

export default function ChatArea({ otherUserId, onClose, onForward }) {
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

    const { data: chatData, isLoading } = useChatMessages(otherUserId);
    const { refetch: updateChatMessages } = useChatUpdates(false, otherUserId, auth?.user?.id);

    const { mutate: sendMessage, isPending: isSending } = useSendMessage();
    const { mutate: deleteMessage } = useDeleteMessage();
    const { mutate: hideMessage } = useHideMessage();
    const { mutate: editMessage } = useEditMessage();
    const { mutate: sendPushNotification } = useSendPushNotification();

    const handleAudioStop = (audioFile) => {
        const formData = new FormData();
        formData.append('to_user_id', otherUserId);
        formData.append('chat_file', audioFile);

        sendMessage(formData, {
            onSuccess: () => {
                updateChatMessages();
                toast.success(df('voice_sent'));
                scrollToBottom();
                sendPushNotification(otherUserId);
            },
            onError: (error) => {
                toast.error(error.message ? error.message : df('error'));
            }
        });
    };

    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording
    } = useAudioRecorder(handleAudioStop);

    const otherUser = chatData?.otherUser;
    const messages = chatData?.chat || [];

    const groupedMessages = useMemo(() => {
        const groups = {};
        messages.forEach((message) => {
            const date = new Date(message.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateKey = date.toLocaleDateString();
            if (date.toDateString() === today.toDateString()) {
                dateKey = df('today');
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateKey = df('yesterday');
            }

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(message);
        });
        return groups;
    }, [messages])

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const scrollToMessage = (messageId) => {
        const element = document.getElementById(`message-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-warning-subtle');
            setTimeout(() => element.classList.remove('bg-warning-subtle'), 2000);
        }
    };

    const handleNextResult = () => {
        if (searchResults.length === 0) return;
        const nextIndex = (currentResultIndex + 1) % searchResults.length;
        setCurrentResultIndex(nextIndex);
        scrollToMessage(searchResults[nextIndex]);
    };

    const handlePrevResult = () => {
        if (searchResults.length === 0) return;
        const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
        setCurrentResultIndex(prevIndex);
        scrollToMessage(searchResults[prevIndex]);
    };

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

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);

            files.forEach((file) => {
                const formData = new FormData();
                formData.append('to_user_id', otherUserId);
                formData.append('chat_file', file);

                setIsUploading(true);
                sendMessage(formData, {
                    onSuccess: () => {
                        updateChatMessages();
                        setIsUploading(false);
                    },
                    onError: (error) => {
                        toast.error(error.message ? error.message : df('error'));
                        setIsUploading(false);
                    }
                });
            });

            sendPushNotification(otherUserId);
        }
    };

    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleReply = (message) => {
        setReplyingTo(message);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleEdit = (message) => {
        setEditingMessage(message);
        setMessage(message.message);
        setReplyingTo(null);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleSend = (event) => {
        event.preventDefault();
        if (!message.trim()) return;

        if (editingMessage) {
            editMessage({ messageId: editingMessage.id, message: message }, {
                onSuccess: () => {
                    updateChatMessages();
                    setEditingMessage(null);
                    setMessage("");
                    setReplyingTo(null);
                    setIsEmojiPickerOpen(false);
                    if (textareaRef.current) textareaRef.current.focus();
                    sendPushNotification(otherUserId);
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

                    updateChatMessages();
                    sendPushNotification(otherUserId);
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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(df('copied_to_clipboard'));
    };

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

        hideMessage({ messageId, otherUserId }, {
            onSuccess: () => {

                toast.success(df('success'));
            },
            onError: () => {
                toast.error(df('error'));
            }
        });
    };

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
                updateChatMessages();
                toast.success(df('success'));
            },
            onError: () => {
                toast.error(df('error'));
            }
        });
    };




    useEffect(() => {
        const channel = new BroadcastChannel('chat_updates_channel');
        channel.onmessage = (event) => {
            if (event.data.type === 'PUSH_NOTIFICATION_RECEIVED') {
                updateChatMessages();

            }
        };

        return () => {
            channel.close();
        };
    }, [otherUserId]);



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

    useEffect(() => {
        if (!isSearchOpen) {
            scrollToBottom();
        }
        Fancybox.bind("[data-fancybox]", {});


    }, [chatData, otherUserId, isSearchOpen]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setCurrentResultIndex(0);
            return;
        }

        const results = messages.filter(message =>
            message.message && message.message.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(message => message.id);

        setSearchResults(results);

        if (results.length > 0) {
            const lastIndex = results.length - 1;
            setCurrentResultIndex(lastIndex);
            scrollToMessage(results[lastIndex]);
        } else {
            setCurrentResultIndex(0);
        }

    }, [searchQuery]);

    useEffect(() => {
        if (!isLoading && textareaRef.current && !isSearchOpen && !replyingTo && !editingMessage) {
            textareaRef.current.focus();
        }
    }, [isLoading, otherUserId, isSearchOpen, replyingTo, editingMessage]);

    if (isLoading && !chatData) {
        return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-grey h-100">
                <Spinner />
            </div>
        );
    }


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
                                    onError={(event) => { event.target.src = "https://ui-avatars.com/api/?name=" + otherUser?.name }}
                                />
                            </div>

                            <div className="text-truncate flex-grow-1">
                                <div className="fw-bold text-truncate">{otherUser?.name}</div>
                                <div className="small opacity-75 text-truncate">{otherUser?.email}</div>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded px-2 py-1 slide-up-animation flex-grow-1" style={{ maxWidth: '100%' }}>
                            {searchResults.length > 0 && (
                                <div className="d-flex align-items-center gap-1 small text-nowrap">
                                    <span role="button" onClick={handlePrevResult} className="pointer p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path fill="#fff" fillRule="evenodd" d="M8 5.293l3.854 3.853l-.707.708L8 6.707L4.854 9.854l-.708-.708z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span>{searchResults.length > 0 ? currentResultIndex + 1 : 0}</span>
                                    <span className="opacity-75">/</span>
                                    <span>{searchResults.length}</span>
                                    <span role="button" onClick={handleNextResult} className="pointer p-1  ">
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
                                onChange={(event) => setSearchQuery(event.target.value)}
                                style={{ minWidth: '50px' }}
                            />

                            <span role="button" onClick={toggleSearch} className="pointer   ms-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#fff" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-3 align-items-center justify-content-end flex-shrink-0 ms-2">
                    {!isSearchOpen && (
                        <div role="button" onClick={toggleSearch} className="opacity-75  text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g fill="none">
                                    <path fill="currentColor" d="M19 11a8 8 0 1 1-16 0a8 8 0 0 1 16 0" opacity="0.5" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" />
                                </g>
                            </svg>
                        </div>
                    )}

                    {!isSearchOpen && (
                        <div role="button" onClick={onClose} className="d-none d-md-block opacity-75  text-white">
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

            <div
                className="chat-messages flex-grow-1 overflow-auto p-3"
                ref={chatContainerRef}
                style={{
                    backgroundColor: 'var(--theme-color-light)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='385' height='192.5' viewBox='0 0 1600 800'%3E%3Cpath fill='%23FFFFFF' d='M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z'/%3E%3Cpath fill='%23FFFFFF' d='M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z'/%3E%3Cg fill='%23FFF'%3E%3Cpath d='M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7zM740.4 421.4c1.5-.2 3 .5 3.8 1.9 1.1 1.8.4 4.2-1.4 5.3-3.7 2.1-6.4 5.6-7.6 9.5-1.2 4-.8 8.4 1.1 12.1.4.9 1 1.7 1.6 2.7 1 1.7 2.2 3.5 3 5.7 1.4 4 1.2 8.7-.6 13.2-1.4 3.4-3.5 6.6-6.8 10.1-1.5 1.6-3.9 1.7-5.5.2-1.6-1.4-1.7-3.9-.2-5.4 2.6-2.8 4.3-5.3 5.3-7.7 1.1-2.8 1.3-5.6.5-7.9-.5-1.3-1.3-2.7-2.2-4.1-.6-1-1.3-2.1-1.9-3.2-2.8-5.4-3.4-11.9-1.7-17.8 1.8-5.9 5.8-11 11.2-14C739.4 421.6 739.9 421.4 740.4 421.4zM261.3 590.9c5.7 6.8 9 15.7 9.4 22.4.5 7.3-2.4 16.4-10.2 20.4-3 1.5-6.7 2.2-11.2 2.2-7.9-.1-12.9-2.9-15.4-8.4-2.1-4.7-2.3-11.4 1.8-15.9 3.2-3.5 7.8-4.1 11.2-1.6 1.2.9 1.5 2.7.6 3.9-.9 1.2-2.7 1.5-3.9.6-1.8-1.3-3.6.6-3.8.8-2.4 2.6-2.1 7-.8 9.9 1.5 3.4 4.7 5 10.4 5.1 3.6 0 6.4-.5 8.6-1.6 4.7-2.4 7.7-8.6 7.2-15-.5-7.3-5.3-18.2-13-23.9-4.2-3.1-8.5-4.1-12.9-3.1-3.1.7-6.2 2.4-9.7 5-6.6 5.1-11.7 11.8-14.2 19-2.7 7.7-2.1 15.8 1.9 23.9.7 1.4.1 3.1-1.3 3.7-1.4.7-3.1.1-3.7-1.3-4.6-9.4-5.4-19.2-2.2-28.2 2.9-8.2 8.6-15.9 16.1-21.6 4.1-3.1 8-5.1 11.8-6 6-1.4 12 0 17.5 4C257.6 586.9 259.6 588.8 261.3 590.9z'/%3E%3Ccircle cx='1013.7' cy='153.9' r='7.1'/%3E%3Ccircle cx='1024.3' cy='132.1' r='7.1'/%3E%3Ccircle cx='1037.3' cy='148.9' r='7.1'/%3E%3Cpath d='M1508.7 297.2c-4.8-5.4-9.7-10.8-14.8-16.2 5.6-5.6 11.1-11.5 15.6-18.2 1.2-1.7.7-4.1-1-5.2-1.7-1.2-4.1-.7-5.2 1-4.2 6.2-9.1 11.6-14.5 16.9-4.8-5-9.7-10-14.7-14.9-1.5-1.5-3.9-1.5-5.3 0-1.5 1.5-1.5 3.9 0 5.3 4.9 4.8 9.7 9.8 14.5 14.8-1.1 1.1-2.3 2.2-3.5 3.2-4.1 3.8-8.4 7.8-12.4 12-1.4 1.5-1.4 3.8 0 5.3 0 0 0 0 0 0 1.5 1.4 3.9 1.4 5.3-.1 3.9-4 8.1-7.9 12.1-11.7 1.2-1.1 2.3-2.2 3.5-3.3 4.9 5.3 9.8 10.6 14.6 15.9.1.1.1.1.2.2 1.4 1.4 3.7 1.5 5.2.2C1510 301.2 1510.1 298.8 1508.7 297.2zM327.6 248.6l-.4-2.6c-1.5-11.1-2.2-23.2-2.3-37 0-5.5 0-11.5.2-18.5 0-.7 0-1.5 0-2.3 0-5 0-11.2 3.9-13.5 2.2-1.3 5.1-1 8.5.9 5.7 3.1 13.2 8.7 17.5 14.9 5.5 7.8 7.3 16.9 5 25.7-3.2 12.3-15 31-30 32.1L327.6 248.6zM332.1 179.2c-.2 0-.3 0-.4.1-.1.1-.7.5-1.1 2.7-.3 1.9-.3 4.2-.3 6.3 0 .8 0 1.7 0 2.4-.2 6.9-.2 12.8-.2 18.3.1 12.5.7 23.5 2 33.7 11-2.7 20.4-18.1 23-27.8 1.9-7.2.4-14.8-4.2-21.3l0 0C347 188.1 340 183 335 180.3 333.6 179.5 332.6 179.2 332.1 179.2zM516.3 60.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C517.3 60.4 516.8 60.8 516.3 60.8zM506.1 70.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C506.4 70.5 506.2 70.5 506.1 70.5zM494.1 64.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C494.7 64.3 494.4 64.4 494.1 64.4zM500.5 55.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C500.9 55.3 500.7 55.3 500.5 55.3zM506.7 55c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C507.4 54.8 507.1 55 506.7 55zM1029.3 382.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C1030.3 382.4 1029.8 382.8 1029.3 382.8zM1019.1 392.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C1019.4 392.5 1019.2 392.5 1019.1 392.5zM1007.1 386.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C1007.7 386.3 1007.4 386.4 1007.1 386.4zM1013.5 377.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C1013.9 377.3 1013.7 377.3 1013.5 377.3zM1019.7 377c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C1020.4 376.8 1020.1 377 1019.7 377zM1329.7 573.4c-1.4 0-2.9-.2-4.5-.7-8.4-2.7-16.6-12.7-18.7-20-.4-1.4-.7-2.9-.9-4.4-8.1 3.3-15.5 10.6-15.4 21 0 1.5-1.2 2.7-2.7 2.8 0 0 0 0 0 0-1.5 0-2.7-1.2-2.7-2.7-.1-6.7 2.4-12.9 7-18 3.6-4 8.4-7.1 13.7-8.8.5-6.5 3.1-12.9 7.4-17.4 7-7.4 18.2-8.9 27.3-10.1l.7-.1c1.5-.2 2.9.9 3.1 2.3.2 1.5-.9 2.9-2.3 3.1l-.7.1c-8.6 1.2-18.4 2.5-24 8.4-3 3.2-5 7.7-5.7 12.4 7.9-1 17.7 1.3 24.3 5.7 4.3 2.9 7.1 7.8 7.2 12.7.2 4.3-1.7 8.3-5.2 11.1C1335.2 572.4 1332.6 573.4 1329.7 573.4zM1311 546.7c.1 1.5.4 3 .8 4.4 1.7 5.8 8.7 14.2 15.1 16.3 2.8.9 5.1.5 7.2-1.1 2.7-2.1 3.2-4.8 3.1-6.6-.1-3.2-2-6.4-4.8-8.3C1326.7 547.5 1317.7 545.6 1311 546.7z'/%3E%3C/g%3E%3C/svg%3E\")`,
                    backgroundAttachment: 'fixed'
                }}
            >
                {messages.length === 0 && (
                    <div className="text-center my-auto p-5 opacity-75">
                        {df('no_chats_message')}
                    </div>
                )}

                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date}>
                        <div className="chat-date-divider ">
                            <span>{date}</span>
                        </div>
                        {dayMessages.map((message) => {
                            const isMine = message.from_user_id === auth.user.id;
                            return (
                                <div key={message.id} id={`message-${message.id}`} className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
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
                                        {message.message && message.message.trim() !== '' && (
                                            <div className="mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {isLink(message.message)
                                                    ? <a href={ensureProtocol(message.message)} target="_blank">{message.message}</a>
                                                    : message.message}
                                                {message.is_edited == 1 && (
                                                    <span className="ms-1 opacity-75 x-small" style={{ fontSize: '0.7rem' }}>({df('edited')})</span>
                                                )}
                                            </div>
                                        )}
                                        {message.file && (
                                            <div className="mb-2 rounded text-dark overflow-hidden">
                                                {isImage(message.file) ? (
                                                    <a href={uploadsUrl + '/' + message.file} data-fancybox={`gallery-${otherUserId}`}>
                                                        <img
                                                            src={uploadsUrl + '/' + message.file}
                                                            alt="Attachment"
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        />
                                                    </a>
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
                            <textarea
                                ref={textareaRef}
                                className="form-control border-0 shadow-none px-0"
                                placeholder={df('type_message')}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                style={{ height: '40px', resize: 'none', lineHeight: '25px' }}
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

                {!message.trim() && !isRecording && (
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

                {(message.trim() || isRecording) && (
                    <button type={isRecording ? "button" : "submit"}
                        className={`btn text-white shadow-sm ms-1 ${isRecording ? 'bg-danger' : 'bg-theme'} rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 animate-scale-in`}
                        style={{ width: '40px', height: '40px' }}
                        disabled={isSending && !isRecording}
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
        </div>
    );
}
