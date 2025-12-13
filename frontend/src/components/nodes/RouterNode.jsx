// src/components/nodes/RouterNode.jsx
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import useFlowsStore from "../../store/useFlowsStore";

export default function RouterNode({ id, data }) {
    const [hover, setHover] = useState(false);

    // get all children of this router
    const children = useFlowsStore((state) => {
        const f = state.getCurrentFlow();
        if (!f?.elements) return [];
        return f.elements
            .filter((e) => e.source === id)
            .map((edge) => f.elements.find((n) => n.id === edge.target))
            .filter(Boolean);
    });

    // add branch
    const addBranch = () => {
        window.dispatchEvent(
            new CustomEvent("router:add-branch", { detail: { routerId: id } })
        );
    };

    // add node inside branch
    const addNodeUnder = (branchId) => {
        window.dispatchEvent(
            new CustomEvent("wpaf:add-node-after", {
                detail: { parentId: branchId },
            })
        );
    };



    return (
        <div
            className="pill-node router-node"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* <div className="pill-badge" style={{ background: "#fff7ed", color: "#92400e" }}>
                Router
            </div> */}

            <div className="pill-container">
                <div className="pill-left" style={{ background: "#fff7ed" }}>
                    <div className="pill-icon">≡</div>
                </div>
                <div className="pill-text">{data?.label || "Router"}</div>

                <Handle type="target" position={Position.Left} />
            </div>

            {/* Branch list */}
            <div className="router-branches">
                {/* {children.map((child) => (
                    <div key={child.id} className="router-branch">
                        → {child.data?.label || "Branch"}
                        <button
                            className="router-branch-add"
                            onClick={() => addNodeUnder(child.id)}
                        >
                            +
                        </button>
                    </div>
                ))} */}
            </div>

            {/* Add branch button */}
            <div className="router-add-branch" onClick={addBranch}>
                + Add Branch
            </div>

            <Handle type="source" position={Position.Right} />

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

        </div>
    );
}
