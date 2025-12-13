import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { FiSettings, FiPlus, FiTrash2 } from "react-icons/fi";

export default function ConditionNode({ id, data }) {
    const [hover, setHover] = useState(false);
    const rules = data?.meta?.conditions || [];
    const hasFallback = data?.meta?.fallback;

    const openDrawer = () => {
        window.dispatchEvent(new CustomEvent("wpaf:open-condition-drawer", {
            detail: { nodeId: id }
        }));
    };

    const addRule = () => {
        window.dispatchEvent(new CustomEvent("condition:add-rule", {
            detail: { nodeId: id }
        }));
    };

    const deleteRule = (ruleId) => {
        window.dispatchEvent(new CustomEvent("condition:delete-rule", {
            detail: { nodeId: id, ruleId }
        }));
    };

    const addNodeUnderRule = (ruleId) => {
        window.dispatchEvent(new CustomEvent("condition:add-node-under-rule", {
            detail: { conditionNodeId: id, ruleId }
        }));
    };

    const addFallback = () => {
        window.dispatchEvent(new CustomEvent("condition:add-fallback", {
            detail: { nodeId: id }
        }));
    };

    return (
        <div
            className="condition-card card"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* HEADER */}
            <div className="condition-header card-header">
                <div className="row">
                    <div className="col-10">
                        <div className="condition-title">Conditions</div>
                    </div>
                    <div className="col-2">

                        <div className="condition-gear text-danger" onClick={openDrawer}>
                            <FiTrash2 size={18} />
                        </div>

                    </div>
                </div>

                {/* {hover && (
                    <div className="condition-gear" onClick={openDrawer}>
                        <FiSettings size={18} />
                    </div>
                )} */}
            </div>

            <div className="condition-body card-body">

                {rules.map((rule, index) => (
                    <div key={rule.id} className="condition-row row">

                        {/* Label */}
                        <div className="condition-label-box col-8">
                            {index + 1}. {rule.label}
                        </div>

                        {/* Add node under rule */}
                        <div className="col-4 d-flex">
                            <button
                                className=" btn btn-outline-primary btn-sm me-1"
                                onClick={() =>
                                    window.dispatchEvent(
                                        new CustomEvent("condition:add-node-under-rule", {
                                            detail: { conditionNodeId: id, ruleId: rule.id }
                                        })
                                    )
                                }
                            >
                                <FiPlus size={14} />
                            </button>


                            {/* Delete rule */}
                            <button className=" btn btn-outline-danger btn-sm" onClick={() => deleteRule(rule.id)}>
                                <FiTrash2 size={14} />
                            </button>
                        </div>

                        {/* Auto-positioned handle (NO manual top) */}
                        <Handle
                            type="source"
                            id={`rule-${rule.id}`}
                            position={Position.Right}
                            className="cond-handle p-0"
                        />
                    </div>
                ))}

                {/* Add new condition */}
                <div className=" btn btn-primary btn-sm mt-2" onClick={addRule}>
                    <FiPlus size={14} /> Add Condition
                </div>

                {/* Fallback */}
                {/* {hasFallback ? (
                    <div className="condition-row">
                        <div className="condition-label-box">No Condition Matched</div>

                        <Handle
                            type="source"
                            id="fallback"
                            position={Position.Right}
                            className="cond-handle"
                        />
                    </div>
                ) : (
                    <div className="condition-add-row" onClick={addFallback}>
                        Add “No Condition Matched”
                    </div>
                )} */}

            </div>

            {/* Incoming */}
            < Handle type="target" position={Position.Left} />
        </div>
    );
}
