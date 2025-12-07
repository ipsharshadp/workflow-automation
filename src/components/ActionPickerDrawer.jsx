// src/components/ActionPickerDrawer.jsx
import React from "react";
import useFlowsStore from "../store/useFlowsStore";
import apps from "../data/apps";
import tools from "../data/tools";
// If you created the CSS file from the patch, import it here:
// import "../styles/action-picker.css";

export default function ActionPickerDrawer() {
    const [open, setOpen] = React.useState(false);
    const [nodeId, setNodeId] = React.useState(null);
    const [mode, setMode] = React.useState("root"); // root | apps | tools
    const [query, setQuery] = React.useState("");
    const [keepOpen, setKeepOpen] = React.useState(false);

    // Listen for event
    React.useEffect(() => {
        const h = (e) => {
            const detail = e?.detail || {};
            setNodeId(detail.nodeId ?? null);
            setMode("root");
            setQuery("");
            setOpen(true);
        };
        window.addEventListener("wpaf:open-action-picker", h);

        const onKey = (ev) => {
            if (ev.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("wpaf:open-action-picker", h);
            window.removeEventListener("keydown", onKey);
        };
    }, []);

    const assignApp = React.useCallback(
        (app) => {
            if (!nodeId) return;
            useFlowsStore.getState().setNodeAppById(nodeId, app);
            if (!keepOpen) setOpen(false);
        },
        [nodeId, keepOpen]
    );

    const assignTool = React.useCallback(
        (tool) => {
            if (!nodeId) return;
            useFlowsStore.getState().createToolNodeAfter(nodeId, tool);
            if (!keepOpen) setOpen(false);
        },
        [nodeId, keepOpen]
    );

    if (!open) return null;

    const filteredApps = apps.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
    );
    const filteredTools = tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="drawer-overlay" role="dialog" aria-modal="true">
            <div className="drawer">
                <div className="drawer-header">
                    <h3>Select App & Action</h3>
                    <button aria-label="close" onClick={() => setOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className="drawer-controls" style={{ marginBottom: 10, display: "flex", gap: 8 }}>
                    <input
                        className="drawer-search"
                        placeholder="Search apps & tools..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #e6e6e6" }}
                    />
                    <label className="keep-open" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <input
                            type="checkbox"
                            checked={keepOpen}
                            onChange={(e) => setKeepOpen(e.target.checked)}
                        />
                        Keep open
                    </label>
                </div>

                {/* Back button for apps/tools mode */}
                {mode !== "root" && (
                    <div className="back-btn" onClick={() => setMode("root")} style={{ cursor: "pointer", marginBottom: 8 }}>
                        ← Back
                    </div>
                )}

                {mode === "root" && (
                    <div className="root-list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div className="root-item" onClick={() => setMode("apps")} style={{ padding: 12, borderRadius: 8, border: "1px solid #eee", cursor: "pointer" }}>
                            <span>Apps</span>
                        </div>
                        <div className="root-item" onClick={() => setMode("tools")} style={{ padding: 12, borderRadius: 8, border: "1px solid #eee", cursor: "pointer" }}>
                            <span>Tools</span>
                        </div>
                    </div>
                )}

                {mode === "apps" && (
                    <div className="drawer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        {filteredApps.map((app) => (
                            <div
                                key={app.id}
                                className="drawer-item"
                                onClick={() => assignApp(app)}
                                style={{ padding: 12, borderRadius: 8, background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", border: "1px solid #f0f0f0" }}
                            >
                                {app.icon ? <app.icon size={22} /> : null}
                                <div>{app.name}</div>
                            </div>
                        ))}
                    </div>
                )}

                {mode === "tools" && (
                    <div className="drawer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        {filteredTools.map((t) => (
                            <div
                                key={t.id}
                                className="drawer-item"
                                onClick={() => assignTool(t)}
                                style={{ padding: 12, borderRadius: 8, background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", border: "1px solid #f0f0f0" }}
                            >
                                {t.icon ? <t.icon size={22} /> : null}
                                <div>{t.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
