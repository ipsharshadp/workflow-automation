import React from "react";
import "./drawer.css";

export default function Drawer({
    isOpen,
    title,
    children,
    onClose,
    keepOpen = false,
}) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="drawer-backdrop"
                    onClick={() => {
                        if (!keepOpen) onClose();
                    }}
                />
            )}

            {/* Drawer Panel */}
            <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
                <div className="drawer-header">
                    <h3>{title}</h3>

                    {/* FIXED: close button now works */}
                    <button
                        className="drawer-close-btn"
                        onClick={() => {
                            if (!keepOpen) onClose();
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div className="drawer-content">{children}</div>
            </div>
        </>
    );
}
