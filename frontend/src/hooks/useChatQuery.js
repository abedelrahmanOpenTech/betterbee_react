import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../config";
import { http } from "../utils/http";

export function useChatUsersQuery() {
    return useQuery({
        queryKey: ["chat-users"],
        queryFn: async () => {
            return await http(apiUrl + "/chat/users");
        },
    });
}

export function useChatMessagesQuery(otherUserId) {
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
                body: data, // FormData or JSON
            });
        },
        onSuccess: (response, variables) => {
            if (response.status === 'success') {
                queryClient.invalidateQueries(["chat-messages", variables.get ? variables.get('to_user_id') : variables.to_user_id]);
            }
        }
    });
}

export function useChatNotificationsQuery() {
    return useQuery({
        queryKey: ["chat-notifications"],
        queryFn: async () => {
            return await http(apiUrl + "/chat/get-notification");
        },
        refetchInterval: 5000, // Poll every 5 seconds
    });
}

export function useMarkAsUnread() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (otherUserId) => {
            return await http(apiUrl + `/chat/mark-as-unread/${otherUserId}`, {
                method: "post"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chat-users"]);
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
        onSuccess: (data, variables) => {
            // Invalidate chat messages query. We need otherUserId, but it's not passed directly usually.
            // We can invalidate all chat-messages or pass payload.
            // Best to just invalidate all "chat-messages" queries for simplicity or refetch active.
            queryClient.invalidateQueries(["chat-messages"]);
        }
    });
}

export function useHideMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ messageId }) => {
            return await http(apiUrl + `/chat/hide-message/${messageId}`, {
                method: "post"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chat-messages"]);
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
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chat-messages"]);
        }
    });
}

export function useChatUpdates(otherUserId, currentUserId) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["chat-updates", otherUserId],
        queryFn: async () => {
            const chatMessagesData = queryClient.getQueryData(["chat-messages", otherUserId]);
            const messages = chatMessagesData?.chat || [];

            const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
            const unreadMessagesIds = messages
                .filter(m => m.from_user_id === currentUserId && m.is_read === 0)
                .map(m => m.id);

            const response = await http(apiUrl + `/chat/get-chat-updates/${otherUserId}`, {
                method: 'post',
                body: JSON.stringify({
                    lastMessageId,
                    unreadMessagesIds: JSON.stringify(unreadMessagesIds)
                })
            });

            if (response.status === 'success') {
                queryClient.setQueryData(["chat-messages", otherUserId], (oldData) => {
                    if (!oldData) return oldData;

                    let newChat = [...oldData.chat];
                    let hasChanges = false;

                    // 1. Add new messages
                    if (response.chat && response.chat.length > 0) {
                        const newMsgs = response.chat.filter(nm => !newChat.find(om => om.id === nm.id));
                        if (newMsgs.length > 0) {
                            newChat = [...newChat, ...newMsgs];
                            hasChanges = true;
                        }
                    }

                    // 2. Update read status
                    if (response.messagesInfo && response.messagesInfo.length > 0) {
                        response.messagesInfo.forEach(info => {
                            const index = newChat.findIndex(m => m.id === info.id);
                            if (index !== -1 && newChat[index].is_read !== info.is_read) {
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

                    return hasChanges ? { ...oldData, chat: newChat } : oldData;
                });
            }
            return response;
        },
        enabled: !!otherUserId && !!currentUserId,
        refetchInterval: 3000,
    });
}
