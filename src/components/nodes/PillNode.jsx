import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import useFlowsStore from "../../store/useFlowsStore";

export default function PillNode({ id, data }) {
    const [hover, setHover] = useState(false);

    const meta = data?.meta || {};
    const isFirstNode = meta.isFirstNode || false;

    // Subscribe ONLY to hasChild (this triggers correct re-render after delete or add)
    const hasChild = useFlowsStore((state) => {
        const f = state.getCurrentFlow();
        if (!f?.elements) return false;
        return f.elements.some((el) => el.source === id);
    });
    console.log("hasChild", hasChild);
    console.log("data", data);
    console.log("id", id);

    const showNext = !hasChild;

    // Show settings if app/tool selected, else show +
    const hasAction = !!(meta.app || meta.tool || meta.appName || meta.kind);

    const openPicker = () => {
        window.dispatchEvent(
            new CustomEvent("wpaf:open-action-picker", {
                detail: { action: "open-app-picker", nodeId: id },
            })
        );
    };

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

    return (
        <div
            className="pill-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="pill-container">
                {/* LEFT ICON (settings or add app) */}
                <div className="pill-left" onClick={openPicker}>
                    {hasAction ? <FiSettings size={20} /> : <FiPlus size={22} />}
                </div>

                {/* LABEL */}
                <div className="pill-text">{data?.label || "Select App"}</div>

                {/* NODE MENU (edit + delete) */}
                <div className="node-menu">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                            ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={openPicker}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={deleteNode} className="text-danger">
                                Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Handle type="source" position={Position.Right} />
                <Handle type="target" position={Position.Left} />
            </div>

            {/* PLUS ONLY FOR LAST NODE */}
            {showNext && (
                <div className="pill-next">
                    <div className="pill-dash"></div>
                    <div className="pill-next-box" onClick={addAfter}>
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
