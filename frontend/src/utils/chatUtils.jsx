
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';

export const MySwal = withReactContent(Swal);

export const CustomToggle = ({ children, onClick, ref }) => (
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

export const ThreeDotsToggle = ({ onClick, ref }) => (
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

export const MessageOptionsToggle = ({ onClick, ref }) => (
    <span
        ref={ref}
        onClick={(event) => {
            event.preventDefault();
            onClick(event);
        }}
        className="pointer text-muted p-1 opacity-75 d-flex align-items-center"
        style={{ fontSize: '0.8rem' }}
    >
        <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4a2 2 0 0 1 0-4m0-6a2 2 0 1 1 0 4a2 2 0 0 1 0-4" />
        </svg>
    </span>
);

export const FileIcon = ({ filename }) => {
    const ext = filename.split('.').pop().toLowerCase();

    // PDF Icon
    if (ext === 'pdf') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 13v-1h6v1" /><path d="M9 17v-1h6v1" /><path d="M9 15h6" />
            </svg>
        );
    }

    // Word Icon
    if (['doc', 'docx'].includes(ext)) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18V12" /><path d="M9 18V15" /><path d="M15 18V15" />
            </svg>
        );
    }

    // Excel Icon
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /><path d="M8 15h8" />
            </svg>
        );
    }

    // Archive Icon
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 12v6" /><path d="M10 15h4" /><path d="M10 12h4" /><path d="M10 18h4" />
            </svg>
        );
    }

    // Generic File Icon
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
};
