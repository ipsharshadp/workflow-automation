import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import useFlowsStore from "../../store/useFlowsStore";

export default function PillNode({ id, data }) {
    const [hover, setHover] = useState(false);

    const meta = data?.meta || {};
    const isTrigger = meta.type === "trigger" || id.includes("trigger");
    const isFirstNode = meta.isFirstNode || false;
    const flow = useFlowsStore.getState().getCurrentFlow();
    const hasChild = flow.elements.some(e => e.source === id);
    const showNext = !hasChild;


    return (
        <div
            className="pill-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* 🔶 Trigger Badge */}
            {isTrigger && (
                <div className="pill-trigger-tag">
                    <span>Trigger</span>
                    <div className="pill-trigger-count">1</div>
                </div>
            )}

            {/* Main pill container */}
            <div className="pill-container" >
                {/* Left icon */}
                <div className="pill-left" onClick={(e) => {
                    e.stopPropagation();
                    console.log("click open app pill-left", id)
                    window.dispatchEvent(
                        new CustomEvent("wpaf:open-action-picker", {
                            detail: { action: "open-app-picker", nodeId: id },
                        })
                    );
                }}>
                    <FiPlus size={22} />
                </div>

                {/* Label */}
                <div className="pill-text">
                    {data?.label || "Select an app"}
                </div>

                <div className="node-menu">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm">⋮</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="text-danger" onClick={(e) => {
                                e.stopPropagation();
                                window.dispatchEvent(
                                    new CustomEvent("wpaf:delete-node", { detail: { id } })
                                );
                            }} >Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>


                {/* Output connector */}
                <div className="pill-connector"></div>

                <Handle type="source" position={Position.Right} />
                <Handle type="target" position={Position.Left} />
            </div>

            {/* Dotted next-step add */}
            {showNext && (
                <div className="pill-next">
                    <div className="pill-dash" />
                    <div
                        className="pill-next-box"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("click open app pill-next-box", id)
                            window.dispatchEvent(
                                new CustomEvent("wpaf:add-node-after", {
                                    detail: { parentId: id }
                                })
                            );
                        }}
                    >
                        +
                    </div>
                </div>
            )}

            {/* Hover Toolbar */}
            {/* {hover && (
                <div className="pill-toolbar">
                    <div
                        className="pill-tool-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(
                                new CustomEvent("wpaf:open-node-editor", {
                                    detail: { nodeId: id },
                                })
                            );
                        }}
                    >
                        <FiSettings size={16} />
                    </div>

                    <div
                        className="pill-tool-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("click open app pill-tool-btn", id)
                            window.dispatchEvent(
                                new CustomEvent("wpaf:open-action-picker", {
                                    detail: { action: "open-app-picker", nodeId: id },
                                })
                            );
                        }}
                    >
                        <FiPlus size={16} />
                    </div>
                </div>
            )} */}

            {/* Delete Button */}
            {!isFirstNode && (
                <div
                    className="pill-delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(
                            new CustomEvent("wpaf:delete-node", { detail: { id } })
                        );
                    }}
                >
                    <FiTrash2 size={18} />
                </div>
            )}


        </div>
    );
}
