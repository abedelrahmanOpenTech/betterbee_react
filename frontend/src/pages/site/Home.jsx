import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { df } from "../../utils/lang";
import useAuth from "../../stores/useAuth";
import { useChatUsersQuery, useChatNotificationsQuery, useMarkAsUnread } from "../../hooks/useChatQuery";
import Spinner from "../../components/ui/Spinner";
import { useAuthInit } from "../../hooks/useAuthQuery";
import { uploadsUrl } from "../../config";
import ChatArea from "../../components/chat/ChatArea";
import ProfileModal from "../../components/chat/ProfileModal";
import SettingsModal from "../../components/chat/SettingsModal";
import toast from "react-hot-toast";

const CustomToggle = ({ children, onClick, ref }) => (
    <div
        ref={ref}
        onClick={(event) => {
            event.preventDefault();
            onClick(event);
        }}
        className="cursor-pointer"
    >
        {children}
    </div>
);

const ThreeDotsToggle = ({ onClick, ref }) => (
    <span
        ref={ref}
        onClick={(event) => {
            event.preventDefault();
            onClick(event);
        }}
        className="pointer hover-splash p-2 rounded d-flex align-items-center justify-content-center"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14 18a2 2 0 1 1-4 0a2 2 0 0 1 4 0m0-6a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
        </svg>
    </span>
);

export default function Home() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const { data: authData, isLoading: isAuthLoading } = useAuthInit();
    const { data: usersData, isLoading: isUsersLoading } = useChatUsersQuery();
    const { data: notificationsData } = useChatNotificationsQuery();
    const { mutate: markAsUnread } = useMarkAsUnread();

    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

    const onlineUsers = notificationsData?.onlineUsers || [];
    const unreadMessages = notificationsData?.unreadMessages || {};

    const filteredUsers = (usersData?.users || []).map(user => {
        const unreadCount = unreadMessages[user.id] ? unreadMessages[user.id].length : 0;
        return {
            ...user,
            is_online: onlineUsers.some(onlineUser => onlineUser.id === user.id) || user.is_online,
            unread_count: unreadCount
        };
    }).filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMarkAsUnread = (userId) => {
        markAsUnread(userId, {
            onSuccess: () => {
                toast.success(df('success'));
                if (selectedUserId === userId) {
                    setSelectedUserId(null);
                }
            },
            onError: () => {
                toast.error(df('error'));
            }
        });
    };

    useEffect(() => {
        if (!isAuthLoading && !auth.accessToken) {
            navigate("/login");
        }
    }, [isAuthLoading, auth.accessToken]);

    useEffect(() => {
        if (notificationsData?.newMessageFound) {
            audioRef.current.play().catch(event => { });
        }
    }, [notificationsData?.newMessageFound]);

    if (isAuthLoading || isUsersLoading) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center bg-grey">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 vh-100 d-flex flex-column bg-light slide-up-animation overflow-hidden">
            <div className="row g-0 flex-grow-1 overflow-hidden h-100">
                <div className={`col-12 col-md-3 px-0 d-flex flex-column overflow-auto border-end bg-white h-100 ${selectedUserId ? 'd-none d-md-flex' : 'd-flex'}`}>
                    <div className="bg-theme text-white d-flex justify-content-between px-2 align-items-center shadow-sm flex-shrink-0 z-99" style={{ height: '60px' }}>
                        <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setShowProfile(true)}>
                            <img
                                src={auth.user?.profile ? uploadsUrl + '/' + auth.user.profile : "https://placehold.co/100x100?text=" + auth.user?.name?.[0]}
                                className="rounded-circle border border-2 border-white"
                                style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                                alt=""
                            />
                            <span className="fw-bold">{auth.user?.name}</span>
                        </div>

                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle}>
                                <button className="btn btn-sm text-white p-1 shadow-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3 9.5A1.5 1.5 0 1 1 3 6.5a1.5 1.5 0 0 1 0 3zm5 0A1.5 1.5 0 1 1 8 6.5a1.5 1.5 0 0 1 0 3zm5 0A1.5 1.5 0 1 1 13 6.5a1.5 1.5 0 0 1 0 3z" />
                                    </svg>
                                </button>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow border-0 rounded-theme">
                                <Dropdown.Item className="py-2" onClick={() => setShowProfile(true)}>
                                    {df('profile')}
                                </Dropdown.Item>
                                <Dropdown.Item className="py-2" onClick={() => setShowSettings(true)}>
                                    {df('settings')}
                                </Dropdown.Item>
                                <Dropdown.Item className="py-2" onClick={() => window.location.reload()}>
                                    {df('reload')}
                                </Dropdown.Item>
                                <Dropdown.Item className="py-2 text-danger" onClick={() => auth.clear()}>
                                    {df('logout')}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="p-1">
                        <input
                            type="text"
                            className="form-control bg-light shadow-none border"
                            placeholder={df('search') + "..."}
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="overflow-auto flex-grow-1 pb-5" style={{ zIndex: 10 }}>
                        {filteredUsers.length === 0 ? (
                            <div className="p-5 text-center text-secondary small">
                                {df('no_data')}
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className={`${selectedUserId === user.id ? 'bg-light' : ''} d-flex align-items-center justify-content-between list-group-item list-group-item-action pe-1 border-0 border-bottom`}>
                                    <div
                                        role="button"
                                        onClick={() => setSelectedUserId(user.id)}
                                        className={`d-flex align-items-center w-100 gap-3 py-3 ps-1`}
                                    >
                                        <div className={`profile-container flex-shrink-0 border border-3 rounded-circle position-relative ${user.is_online ? 'border-success' : ''}`} style={{ filter: user.is_online ? 'grayscale(0)' : 'grayscale(100%)' }}>
                                            <img
                                                src={user.profile ? uploadsUrl + '/' + user.profile : "https://ui-avatars.com/api/?name=" + user.name}
                                                alt={user.name}
                                                className="rounded-circle bg-white"
                                                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                                                onError={(event) => { event.target.src = "https://ui-avatars.com/api/?name=" + user.name }}
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold text-dark">
                                                {user.name}
                                            </div>
                                            <div className="small text-secondary text-truncate">
                                                {user.last_message_from_me ? df('you') + ': ' : ''}{user.last_message}
                                            </div>
                                        </div>
                                        {user.unread_count > 0 && (
                                            <div className="bg-danger text-white rounded-3 px-2 position-absolute top-0 end-0 m-1">
                                                {user.unread_count}
                                            </div>
                                        )}
                                    </div>

                                    <Dropdown align="end" onClick={(event) => event.stopPropagation()}>
                                        <Dropdown.Toggle as={ThreeDotsToggle} id={`user-dropdown-${user.id}`} />
                                        <Dropdown.Menu className="shadow-sm border-0 rounded-theme">
                                            <Dropdown.Item className="py-2" onClick={() => handleMarkAsUnread(user.id)}>
                                                {df('mark_as_unread')}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={`col-12 col-md-9 px-0 position-relative d-flex flex-column h-100 bg-grey ${!selectedUserId ? 'd-none d-md-flex align-items-center justify-content-center border-0' : 'd-flex'}`}>
                    {selectedUserId ? (
                        <ChatArea otherUserId={selectedUserId} onClose={() => setSelectedUserId(null)} />
                    ) : (
                        <div className="text-center p-5 animate-fade-in my-auto mx-auto align-items-center justify-content-center d-flex flex-column">
                            <div className="mb-4 text-theme opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h2 className="fw-bold text-dark">{df('no_chats_title')}</h2>
                            <p className="text-secondary">{df('no_chats_message')}</p>
                        </div>
                    )}
                </div>
            </div>

            <ProfileModal show={showProfile} onClose={() => setShowProfile(false)} />
            <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
}
