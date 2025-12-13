// src/components/nodes/DropPlaceholder.jsx
import React, { useState } from "react";

export default function DropPlaceholder({ parentId }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            className={"drop-placeholder" + (hover ? " hover" : "")}
            onDragOver={(e) => {
                e.preventDefault();
            }}
            onDragEnter={() => setHover(true)}
            onDragLeave={() => setHover(false)}
            onDrop={(e) => {
                e.preventDefault();
                setHover(false);

                const appRaw = e.dataTransfer.getData("application/x-app");
                const toolRaw = e.dataTransfer.getData("application/x-tool");

                let payload = null;

                if (appRaw) payload = { type: "app", data: JSON.parse(appRaw) };
                if (toolRaw) payload = { type: "tool", data: JSON.parse(toolRaw) };

                if (!payload) return;

                window.dispatchEvent(
                    new CustomEvent("wpaf:drop-on-node", {
                        detail: { parentId, payload }
                    })
                );
            }}
            style={{
                width: 48,
                height: 48,
                border: "2px dashed #c5c5c5",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#777",
                background: hover ? "#eef2ff" : "transparent",
                cursor: "pointer"
            }}
        >
            +
        </div>
    );
}
