import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import useFlowsStore from "../../store/useFlowsStore";
import { onSelectAction } from "../../utils/Helper";

export default function PillNode({ id, data }) {
    const [hover, setHover] = useState(false);
    const [dropHover, setDropHover] = useState(false);

    const meta = data?.meta || {};
    const isFirstNode = meta.isFirstNode || false;

    const hasChild = useFlowsStore((state) => {
        const f = state.getCurrentFlow();
        if (!f?.elements) return false;
        return f.elements.some((el) => el.source === id);
    });


    if (isFirstNode && data.label === "Select an app" && !hasChild) {
        window._addingNewNode = true;
    }

    const showNext = !hasChild;
    const hasAction = !!(meta.app || meta.tool || meta.appName || meta.kind);

    const addAfter = () => {
        window.dispatchEvent(
            new CustomEvent("wpaf:add-node-after", {
                detail: { parentId: id },
            })
        );
    };

    const deleteNode = () => {
        window.dispatchEvent(
            new CustomEvent("wpaf:delete-node", {
                detail: { id },
            })
        );
    };

    const configNodeSettings = () => {
        window.dispatchEvent(
            new CustomEvent("wpaf:config-node-settings", {
                detail: { id, data },
            })
        );
    };

    const openPicker = () => {
        window.dispatchEvent(
            new CustomEvent("wpaf:open-action-picker", {
                detail: { action: "open-app-picker", nodeId: id },
            })
        );
    };

    return (
        <div
            className="pill-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="pill-container">
                {/* LEFT ICON (settings or add app) */}
                {isFirstNode && data.label === "Select an app" && !hasChild && (
                    <div className="pill-left" onClick={openPicker}>
                        {hasAction ? <FiSettings size={20} /> : <FiPlus size={22} />}
                    </div>
                )}

                {!isFirstNode && data.label !== "Select an app" && hasAction && (
                    <div className="pill-left" onClick={configNodeSettings}>
                        <FiSettings size={20} />
                    </div>
                )}


                {/* LABEL */}
                <div className="pill-text">{data?.label || "Start"}</div>

                {!isFirstNode && (
                    <div className="node-menu">
                        <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm">
                                ⋮
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={configNodeSettings}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={deleteNode} className="text-danger">
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}

                <Handle type="source" position={Position.Right} />
                <Handle type="target" position={Position.Left} />
            </div>

            {/* PLUS ONLY FOR LAST NODE */}
            {showNext && (
                // <div className="pill-next">
                //     <div className="pill-dash"></div>
                //     <div className="pill-next-box" onClick={addAfter}>
                //         +
                //     </div>
                // </div>
                <div className="pill-next">
                    <div className="pill-dash"></div>

                    {/* <div
                        className={"pill-next-box" + (dropHover ? " drop-hover" : "")}
                        onClick={addAfter}
                        onDragOver={(e) => {
                            // must preventDefault to allow drop
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "copy";
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                            setDropHover(true);
                        }}
                        onDragLeave={() => setDropHover(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDropHover(false);

                            const appRaw = e.dataTransfer.getData("application/x-app");
                            const toolRaw = e.dataTransfer.getData("application/x-tool");
                            let payload = null;

                            if (appRaw) {
                                try {
                                    payload = { type: "app", data: JSON.parse(appRaw) };
                                } catch (err) {
                                    payload = { type: "app", data: { id: appRaw } };
                                }
                            } else if (toolRaw) {
                                try {
                                    payload = { type: "tool", data: JSON.parse(toolRaw) };
                                } catch (err) {
                                    payload = { type: "tool", data: { id: toolRaw } };
                                }
                            } else {
                                // fallback: try text/plain
                                const fallback = e.dataTransfer.getData("text/plain");
                                if (fallback) payload = { type: "unknown", data: { id: fallback } };
                            }

                            if (!payload) return;

                            window.dispatchEvent(
                                new CustomEvent("wpaf:drop-on-node", {
                                    detail: { parentId: id, payload },
                                })
                            );
                        }}
                    >
                        +
                    </div> */}

                    <div
                        className={"pill-next-box" + (dropHover ? " drop-hover" : "")}
                        onClick={addAfter}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "copy";
                        }}
                        onDragEnter={() => setDropHover(true)}
                        onDragLeave={() => setDropHover(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDropHover(false);
                            // console.log("adasdsa", e);
                            const appRaw = e.dataTransfer.getData("application/x-app");
                            const toolRaw = e.dataTransfer.getData("application/x-tool");

                            let payload = null;
                            if (appRaw) payload = JSON.parse(appRaw);
                            if (toolRaw) payload = JSON.parse(toolRaw);

                            if (!payload) return;
                            window._addingNewNode = true;
                            window._droppedInsidePlaceholder = true;
                            onSelectAction(payload, id, data);
                            // console.log("payload", payload);
                            // addAfter()

                            // window.dispatchEvent(
                            //     new CustomEvent("wpaf:drop-on-node", {
                            //         detail: { parentId: id, payload },
                            //     })
                            // );
                        }}
                    >
                        +
                    </div>
                </div>
            )}




            {/* DELETE ICON (not for first node) */}
            {!isFirstNode && (
                <div className="pill-delete" onClick={deleteNode}>
                    <FiTrash2 size={18} />
                </div>
            )}
        </div>
    );
}
