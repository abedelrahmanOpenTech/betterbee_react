import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../config";
import { http } from "../utils/http";

export function useChatUsers() {
    return useQuery({
        refetchInterval: 10000,
        queryKey: ["chat-users"],
        queryFn: async () => {
            return await http(apiUrl + "/chat/users");
        },

    });
}

export function useChatMessages(otherUserId) {
    return useQuery({
        queryKey: ["chat-messages", otherUserId],
        queryFn: async () => {
            return await http(apiUrl + `/chat/messages/${otherUserId}`);
        },
        enabled: !!otherUserId,

    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/chat/create", {
                method: "post",
                body: data,
            });
        },

    });
}



export function useMarkChatAsUnread() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (otherUserId) => {
            return await http(apiUrl + `/chat/mark-as-unread/${otherUserId}`, {
                method: "post"
            });
        }
    });
}

export function useDeleteMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ messageId }) => {
            return await http(apiUrl + `/chat/delete-message/${messageId}`, {
                method: "post"
            });
        },

    });
}

export function useHideMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ messageId, otherUserId }) => {
            return await http(apiUrl + `/chat/hide-message/${messageId}`, {
                method: "post"
            });
        },
        onSuccess: (data, variables) => {
            const { messageId, otherUserId } = variables;
            queryClient.setQueryData(["chat-messages", otherUserId], (oldData) => {
                if (!oldData) return oldData;
                const newChat = oldData.chat.filter(m => m.id != messageId);
                return { ...oldData, chat: newChat }
            });
        }

    });
}

export function useEditMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ messageId, message }) => {
            return await http(apiUrl + `/chat/edit-message/${messageId}`, {
                method: "post",
                body: JSON.stringify({ message })
            });
        }
    });
}

export function useChatUpdates(enabled, otherUserId, currentUserId) {
    const queryClient = useQueryClient();

    return useQuery({
        enabled: enabled,
        queryKey: ["chat-updates", otherUserId],
        queryFn: async () => {
            const chatMessagesData = queryClient.getQueryData(["chat-messages", otherUserId]);
            const messages = chatMessagesData?.chat || [];

            const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
            const unreadMessagesIds = [];
            for (const message of messages) {

                if (message.from_user_id === currentUserId && message.is_read === 0) {
                    unreadMessagesIds.push(message.id);
                }
            }

            const response = await http(apiUrl + `/chat/get-chat-updates/${otherUserId}`, {
                method: 'post',
                body: JSON.stringify({
                    lastMessageId,
                    unreadMessagesIds: JSON.stringify(unreadMessagesIds)
                })
            });

            if (response.status === 'success') {
                queryClient.invalidateQueries({
                    queryKey: ["chat-users"]
                });

                queryClient.setQueryData(["chat-messages", otherUserId], (oldData) => {
                    if (!oldData) return oldData;

                    let newChat = [...oldData.chat];
                    let hasChanges = false;

                    // 1. Add new messages
                    if (response.chat && response.chat.length > 0) {
                        newChat = [...newChat, ...response.chat]
                        hasChanges = true;
                    }

                    // 2. Update read status
                    if (response.messagesInfo && response.messagesInfo.length > 0) {
                        response.messagesInfo.forEach(info => {
                            const index = newChat.findIndex(m => m.id === info.id);
                            if (index !== -1) {
                                newChat[index] = { ...newChat[index], is_read: info.is_read };
                                hasChanges = true;
                            }
                        });
                    }

                    // 3. Update edited messages
                    if (response.editedMessages && response.editedMessages.length > 0) {
                        response.editedMessages.forEach(edited => {
                            const index = newChat.findIndex(m => m.id === edited.id);
                            if (index !== -1) {
                                newChat[index] = { ...newChat[index], message: edited.message, is_edited: edited.is_edited };
                                hasChanges = true;
                            }
                        });
                    }

                    // 4. Remove deleted messages
                    if (response.deletedMessages && response.deletedMessages.length > 0) {
                        const deletedIds = response.deletedMessages.map(dm => dm.id);
                        const filteredChat = newChat.filter(m => !deletedIds.includes(m.id));
                        if (filteredChat.length !== newChat.length) {
                            newChat = filteredChat;
                            hasChanges = true;
                        }
                    }



                    return { ...oldData, chat: newChat }
                });
            }
            return response;
        },


    });
}

export function useSendPushNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (otherUserId) => {
            return await http(apiUrl + `/chat/send-push-notification/${otherUserId}`, {
                method: "post"
            });
        }
    });
}

export function useSendBroadcast() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await http(apiUrl + "/chat/broadcast", {
                method: "post",
                body: data,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chat-users"]
            });
        }
    });
}
