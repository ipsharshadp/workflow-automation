import React from "react";
import Drawer from "./Drawer";

export default function ToolsDrawer({
    isOpen,
    onClose,
    tools,
    onSelectTool,
}) {
    return (
        <Drawer title="Tools" isOpen={isOpen} onClose={onClose}>
            <div className="picker-section">
                <h4>Tools</h4>

                {/* FIXED: now clickable */}
                <div className="picker-list">
                    {tools?.map((tool) => (
                        <button
                            key={tool.id}
                            className="picker-item"
                            onClick={() => onSelectTool(tool)}
                        >
                            {tool.name}
                        </button>
                    ))}
                </div>
            </div>
        </Drawer>
    );
}
