import React from "react";
import Drawer from "./Drawer";

export default function ActionPickerDrawer({
    isOpen,
    onClose,
    actions,
    onSelectAction,
}) {
    return (
        <Drawer title="Select Action" isOpen={isOpen} onClose={onClose}>
            <div className="picker-section">
                <h4>Actions</h4>

                <div className="picker-list">
                    {actions?.map((action) => (
                        <button
                            key={action.id}
                            className="picker-item"
                            onClick={() => onSelectAction(action)}
                        >
                            {action.name}
                        </button>
                    ))}
                </div>
            </div>
        </Drawer>
    );
}
