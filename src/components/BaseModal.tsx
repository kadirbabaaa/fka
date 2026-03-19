import React from 'react';

interface Props {
    onClose: () => void;
    children: React.ReactNode;
    zIndex?: string;
    maxWidth?: string;
}

export const BaseModal: React.FC<Props> = ({
    onClose,
    children,
    zIndex = 'z-50',
    maxWidth = 'max-w-2xl',
}) => (
    <div
        className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/80 backdrop-blur-sm p-4`}
        onClick={onClose}
    >
        <div
            className={`w-full ${maxWidth} max-h-[90vh] bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200`}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);
