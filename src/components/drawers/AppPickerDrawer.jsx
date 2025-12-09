import React from "react";
import Drawer from "./Drawer";

export default function AppPickerDrawer({
    isOpen,
    onClose,
    apps,
    onSelectApp,
}) {
    return (
        <Drawer title="Select App & Action" isOpen={isOpen} onClose={onClose}>
            <div className="picker-section">
                <h4>Apps</h4>

                {/* FIXED: buttons now clickable */}
                <div className="picker-list">
                    {apps?.map((app) => (
                        <button
                            key={app.id}
                            className="picker-item"
                            onClick={() => onSelectApp(app)}
                        >
                            {app.name}
                        </button>
                    ))}
                </div>
            </div>
        </Drawer>
    );
}
