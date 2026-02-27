import { useRef, useEffect } from "react";
import { df } from "../../../utils/lang";
import { uploadsUrl } from "../../../config";

export default function ChatHeader({
    otherUser,
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentResultIndex,
    handlePrevResult,
    handleNextResult,
    toggleSearch,
    onClose
}) {
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    return (
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
    );
}
