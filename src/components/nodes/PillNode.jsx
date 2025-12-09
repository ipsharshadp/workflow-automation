import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import useFlowsStore from "../../store/useFlowsStore";

export default function PillNode({ id, data }) {
    const [hover, setHover] = useState(false);

    const meta = data?.meta || {};
    const isTrigger = meta.type === "trigger" || id.includes("trigger");
    const isFirstNode = meta.isFirstNode || false;

    // get current flow once from store; this won't cause store-wide writes
    const flow = useFlowsStore.getState().getCurrentFlow();
    const hasChild = !!flow?.elements?.some((e) => e.source === id);
    const showNext = !hasChild;

    // if node already has an app/tool show edit icon; otherwise show plus to add app
    const hasAction = !!(meta?.app || meta?.tool || meta?.appName || meta?.kind);

    const openPickerForNode = (nodeId) => {
        window.dispatchEvent(
            new CustomEvent("wpaf:open-action-picker", {
                detail: { action: "open-app-picker", nodeId },
            })
        );
    };

    const addAfter = (parentId) => {
        window.dispatchEvent(
            new CustomEvent("wpaf:add-node-after", {
                detail: { parentId },
            })
        );
    };

    const deleteNode = (nodeId) => {
        window.dispatchEvent(new CustomEvent("wpaf:delete-node", { detail: { id: nodeId } }));
    };

    return (
        <div
            className="pill-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {isTrigger && (
                <div className="pill-trigger-tag">
                    <span>Trigger</span>
                    <div className="pill-trigger-count">1</div>
                </div>
            )}

            <div className="pill-container">
                {/* Left icon: edit if hasAction else add */}
                <div
                    className="pill-left"
                    onClick={(e) => {
                        e.stopPropagation();
                        openPickerForNode(id);
                    }}
                >
                    {hasAction ? <FiSettings size={20} /> : <FiPlus size={22} />}
                </div>

                <div className="pill-text">{data?.label || "Select an app"}</div>

                <div className="node-menu">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">
                            ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPickerForNode(id);
                                }}
                            >
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="text-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(id);
                                }}
                            >
                                Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="pill-connector" />

                <Handle type="source" position={Position.Right} />
                <Handle type="target" position={Position.Left} />
            </div>

            {showNext && (
                <div className="pill-next">
                    <div className="pill-dash" />
                    <div
                        className="pill-next-box"
                        onClick={(e) => {
                            e.stopPropagation();
                            addAfter(id);
                        }}
                    >
                        +
                    </div>
                </div>
            )}

            {!isFirstNode && (
                <div
                    className="pill-delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(id);
                    }}
                >
                    <FiTrash2 size={18} />
                </div>
            )}
        </div>
    );
}
