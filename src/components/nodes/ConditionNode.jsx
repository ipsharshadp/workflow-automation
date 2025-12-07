import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiSettings } from "react-icons/fi";

export default function ConditionNode({ id, data }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            className="condition-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="condition-title">
                <span>Condition</span>
            </div>

            <div className="condition-box">
                <div className="condition-label">
                    {data?.meta?.conditions?.length
                        ? `${data.meta.conditions.length} rules`
                        : "No rules set"}
                </div>

                {hover && (
                    <div
                        className="condition-gear"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(
                                new CustomEvent("wpaf:open-condition-drawer", {
                                    detail: { nodeId: id },
                                })
                            );
                        }}
                    >
                        <FiSettings size={18} />
                    </div>
                )}
            </div>

            {/* in/out handles */}
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
}
