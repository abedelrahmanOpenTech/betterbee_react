import { useState, useEffect, useRef, useMemo } from "react";
import { df } from "../../utils/lang";
import useAuth from "../../stores/useAuth";
import { useChatMessages, useSendMessage, useDeleteMessage, useHideMessage, useEditMessage, useChatUpdates, useSendPushNotification } from "../../hooks/useChatQuery";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { Fancybox } from "@fancyapps/ui";
import { MySwal } from "../../utils/chatUtils";
import AddToProjectModal from "./AddToProjectModal";
import { useQueryClient } from "@tanstack/react-query";


import ChatHeader from "./ChatArea/ChatHeader";
import MessageList from "./ChatArea/MessageList";
import ChatInputArea from "./ChatArea/ChatInputArea";

export default function ChatArea({ otherUserId, onClose, onForward }) {
    const queryClient = useQueryClient();
    const auth = useAuth();
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [showAddToProject, setShowAddToProject] = useState(false);
    const [selectedMessageForTask, setSelectedMessageForTask] = useState(null);

    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const firstOpen = useRef(true);

    const { data: chatData, isLoading, isFetching } = useChatMessages(otherUserId);
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
                updateChatMessages().then(() => {
                    scrollToBottom()
                });
                toast.success(df('voice_sent'));
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
        messages.forEach((m) => {
            const date = new Date(m.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateKey = date.toLocaleDateString();
            if (date.toDateString() === today.toDateString()) {
                dateKey = df('today');
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateKey = df('yesterday');
            }

            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(m);
        });
        return groups;
    }, [messages]);

    const scrollToBottom = (delay = 100) => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight + 500;
            }
        }, delay);
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
        }
    };

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            if (textareaRef.current) textareaRef.current.focus();
            event.target.value = '';
        }
    };

    const handlePaste = (event) => {
        if (event.clipboardData && event.clipboardData.files.length > 0) {
            event.preventDefault();
            const files = Array.from(event.clipboardData.files);
            setSelectedFiles(prev => [...prev, ...files]);
            if (textareaRef.current) textareaRef.current.focus();
        }
    };

    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        if (textareaRef.current) textareaRef.current.focus();
    };

    const handleReply = (msg) => {
        setReplyingTo(msg);
        if (textareaRef.current) textareaRef.current.focus();
    };

    const handleEdit = (msg) => {
        setEditingMessage(msg);
        setMessage(msg.message);
        setReplyingTo(null);
        if (textareaRef.current) textareaRef.current.focus();
    };

    const handleSend = (event) => {
        event.preventDefault();
        if (!message.trim() && selectedFiles.length === 0) return;

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
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file, index) => {
                    const formData = new FormData();
                    formData.append('to_user_id', otherUserId);
                    formData.append('chat_file', file);
                    if (message.trim()) formData.append('message', message);
                    if (replyingTo) formData.append('reply_to', replyingTo.id);

                    setIsUploading(true);
                    sendMessage(formData, {
                        onSuccess: () => {
                            if (index === selectedFiles.length - 1) {
                                setSelectedFiles([]);
                                setMessage("");
                                setReplyingTo(null);
                                setIsEmojiPickerOpen(false);
                                setIsUploading(false);
                                updateChatMessages().then(() => scrollToBottom());
                                sendPushNotification(otherUserId);
                            }
                        },
                        onError: (error) => {
                            toast.error(error.message ? error.message : df('error'));
                            setIsUploading(false);
                        }
                    });
                });
            } else {
                const formData = new FormData();
                formData.append('to_user_id', otherUserId);
                formData.append('message', message);
                if (replyingTo) formData.append('reply_to', replyingTo.id);

                sendMessage(formData, {
                    onSuccess: () => {
                        updateChatMessages().then(() => scrollToBottom());
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
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(df('copied_to_clipboard'));
        } catch (err) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) toast.success(df('copied_to_clipboard'));
                else toast.error(df('error'));
            } catch (fallbackErr) {
                toast.error(df('error'));
            }
        }
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
            onSuccess: () => toast.success(df('success')),
            onError: () => toast.error(df('error'))
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
            onError: () => toast.error(df('error'))
        });
    };

    useEffect(() => {
        firstOpen.current = true;
        const channel = new BroadcastChannel('chat_updates_channel');
        channel.onmessage = (event) => {
            if (event.data.type === 'PUSH_NOTIFICATION_RECEIVED') updateChatMessages();
        };

        queryClient.setQueryData(['chat-users'], (oldData) => {
            if (!oldData) return oldData;
            const updatedUsers = oldData.users.map(user => {
                if (user.id === otherUserId) return { ...user, unread_count: 0 };
                return user;
            });
            return { ...oldData, users: updatedUsers };
        });

        return () => channel.close();
    }, [otherUserId]);

    useEffect(() => {
        if (chatData && !isFetching) {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }
    }, [chatData, isFetching]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setIsEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        Fancybox.bind("[data-fancybox]", {});
    }, [chatData, otherUserId, isSearchOpen]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setCurrentResultIndex(0);
            return;
        }

        const results = messages.filter(m =>
            m.message && m.message.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(m => m.id);

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

    if (isFetching) {
        return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-grey h-100">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column h-100 bg-light slide-up-animation position-relative">
            <ChatHeader
                otherUser={otherUser}
                isSearchOpen={isSearchOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                currentResultIndex={currentResultIndex}
                handlePrevResult={handlePrevResult}
                handleNextResult={handleNextResult}
                toggleSearch={toggleSearch}
                onClose={onClose}
            />

            <MessageList
                chatContainerRef={chatContainerRef}
                groupedMessages={groupedMessages}
                messages={messages}
                userId={auth.user.id}
                otherUserId={otherUserId}
                scrollToMessage={scrollToMessage}
                handleReply={handleReply}
                onForward={onForward}
                handleEdit={handleEdit}
                handleCopy={handleCopy}
                handleDeleteForMe={handleDeleteForMe}
                handleDeleteForEveryone={handleDeleteForEveryone}
                setSelectedMessageForTask={setSelectedMessageForTask}
                setShowAddToProject={setShowAddToProject}
            />

            <ChatInputArea
                message={message}
                setMessage={setMessage}
                isUploading={isUploading}
                isEmojiPickerOpen={isEmojiPickerOpen}
                setIsEmojiPickerOpen={setIsEmojiPickerOpen}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                editingMessage={editingMessage}
                setEditingMessage={setEditingMessage}
                isRecording={isRecording}
                recordingTime={recordingTime}
                startRecording={startRecording}
                stopRecording={stopRecording}
                cancelRecording={cancelRecording}
                handleFileSelect={handleFileSelect}
                handlePaste={handlePaste}
                onEmojiClick={onEmojiClick}
                handleSend={handleSend}
                isSending={isSending}
                textareaRef={textareaRef}
                emojiPickerRef={emojiPickerRef}
                fileInputRef={fileInputRef}
            />

            <AddToProjectModal
                show={showAddToProject}
                onClose={() => {
                    setShowAddToProject(false);
                    setSelectedMessageForTask(null);
                }}
                message={selectedMessageForTask}
            />
        </div>
    );
}
