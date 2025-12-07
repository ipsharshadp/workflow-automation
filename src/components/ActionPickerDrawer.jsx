import React from "react";
import useFlowsStore from "../store/useFlowsStore";
import apps from "../data/apps";
import tools from "../data/tools";

export default function ActionPickerDrawer() {
    const [open, setOpen] = React.useState(false);
    const [nodeId, setNodeId] = React.useState(null);
    const [mode, setMode] = React.useState("root"); // root | apps | tools

    // Listen for event
    React.useEffect(() => {
        const h = (e) => {
            setNodeId(e.detail.nodeId);
            setMode("root");
            setOpen(true);
        };
        window.addEventListener("wpaf:open-action-picker", h);
        return () => window.removeEventListener("wpaf:open-action-picker", h);
    }, []);

    const assignApp = (app) => {
        useFlowsStore.getState().setNodeAppById(nodeId, app);
        setOpen(false);
    };

    const assignTool = (tool) => {
        useFlowsStore.getState().createToolNodeAfter(nodeId, tool);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="drawer-overlay">
            <div className="drawer">

                <div className="drawer-header">
                    <h3>Select App & Action</h3>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                {/* Back button for apps/tools mode */}
                {mode !== "root" && (
                    <div className="back-btn" onClick={() => setMode("root")}>← Back</div>
                )}

                {mode === "root" && (
                    <div className="root-list">
                        <div className="root-item" onClick={() => setMode("apps")}>
                            <span>Apps</span>
                        </div>
                        <div className="root-item" onClick={() => setMode("tools")}>
                            <span>Tools</span>
                        </div>
                    </div>
                )}

                {mode === "apps" && (
                    <div className="drawer-grid">
                        {apps.map((app) => (
                            <div
                                key={app.id}
                                className="drawer-item"
                                onClick={() => assignApp(app)}
                            >
                                <app.icon size={22} />
                                <div>{app.name}</div>
                            </div>
                        ))}
                    </div>
                )}

                {mode === "tools" && (
                    <div className="drawer-grid">
                        {tools.map((t) => (
                            <div
                                key={t.id}
                                className="drawer-item"
                                onClick={() => assignTool(t)}
                            >
                                <t.icon size={22} />
                                <div>{t.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
