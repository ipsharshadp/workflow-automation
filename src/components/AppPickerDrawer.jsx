import React from "react";
import apps from "../data/apps";
import useFlowsStore from "../store/useFlowsStore";

export default function AppPickerDrawer() {
    const [open, setOpen] = React.useState(false);
    const [nodeId, setNodeId] = React.useState(null);

    React.useEffect(() => {
        const handler = (e) => {
            if (e.detail?.action === "open-app-picker") {
                setNodeId(e.detail.nodeId);
                setOpen(true);
            }
        };
        window.addEventListener("wpaf:open-app-picker", handler);
        return () => window.removeEventListener("wpaf:open-app-picker", handler);
    }, []);

    const selectApp = (app) => {
        useFlowsStore.getState().setNodeAppById(nodeId, app);
        setOpen(false);
    };

    return (
        <div className={`drawer-overlay ${open ? "show" : ""}`}>
            {/* CLICK OUTSIDE TO CLOSE */}
            <div
                className="drawer-bg"
                onClick={() => setOpen(false)}
            />

            {/* DRAWER PANEL */}
            <div className="drawer-panel">
                <div className="drawer-head">
                    <h3>Select an App</h3>
                    <button className="drawer-close" onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="drawer-content">
                    {apps.map((a) => {
                        const Icon = a.icon;
                        return (
                            <div
                                key={a.id}
                                className="drawer-item"
                                onClick={() => selectApp(a)}
                            >
                                <div className="drawer-icon"><Icon size={22} /></div>
                                <div className="drawer-label">{a.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
