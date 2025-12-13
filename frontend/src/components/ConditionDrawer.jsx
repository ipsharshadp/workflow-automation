import React from "react";
import useFlowsStore from "../store/useFlowsStore";

const operators = [
    { value: "eq", label: "Equal to" },
    { value: "neq", label: "Not equal" },
    { value: "gt", label: ">" },
    { value: "lt", label: "<" },
    { value: "gte", label: ">=" },
    { value: "lte", label: "<=" },
    { value: "contains", label: "Contains" },
    { value: "ncontains", label: "Not contains" },
];

export default function ConditionDrawer() {
    const [open, setOpen] = React.useState(false);
    const [nodeId, setNodeId] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    // Listen for event fired by ConditionNode
    React.useEffect(() => {
        const h = (e) => {
            const id = e.detail.nodeId;
            const node = useFlowsStore.getState().getCurrentFlow().elements.find(n => n.id === id);

            setNodeId(id);
            setRows(node?.data?.meta?.conditions || []);
            setOpen(true);
        };

        window.addEventListener("wpaf:open-condition-drawer", h);
        return () => window.removeEventListener("wpaf:open-condition-drawer", h);
    }, []);

    const updateRow = (i, field, value) => {
        const copy = [...rows];
        copy[i][field] = value;
        setRows(copy);
    };

    const addRow = () => {
        setRows([...rows, { left: "", op: "eq", right: "" }]);
    };

    const removeRow = (i) => {
        const copy = [...rows];
        copy.splice(i, 1);
        setRows(copy);
    };

    const save = () => {
        useFlowsStore.getState().setNodeConditionsById(nodeId, rows);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="cond-drawer-overlay">
            <div className="cond-drawer">

                <div className="cond-header">
                    <h2>Condition</h2>
                    <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="cond-body">

                    {rows.map((r, i) => (
                        <div key={i} className="cond-row">

                            <input
                                className="cond-input"
                                placeholder="field"
                                value={r.left}
                                onChange={(e) => updateRow(i, "left", e.target.value)}
                            />

                            <select
                                className="cond-select"
                                value={r.op}
                                onChange={(e) => updateRow(i, "op", e.target.value)}
                            >
                                {operators.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                className="cond-input"
                                placeholder="value"
                                value={r.right}
                                onChange={(e) => updateRow(i, "right", e.target.value)}
                            />

                            <button className="cond-delete" onClick={() => removeRow(i)}>🗑</button>
                        </div>
                    ))}

                    <button className="cond-add" onClick={addRow}>+ Add Rule</button>
                </div>

                <div className="cond-footer">
                    <button className="btn cancel" onClick={() => setOpen(false)}>Cancel</button>
                    <button className="btn save" onClick={save}>Save</button>
                </div>

            </div>
        </div>
    );
}
