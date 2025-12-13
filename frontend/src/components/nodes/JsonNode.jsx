// src/components/nodes/JsonNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function JsonNode({ id, data }) {
    return (
        <div className="pill-node json-node">
            <div className="pill-badge" style={{ background: '#f3fdf5', color: '#166534' }}>JSON</div>
            <div className="pill-container">
                <div className="pill-left" style={{ background: '#f3fdf5' }}><div className="pill-icon">{'{}'}</div></div>
                <div className="pill-text">{data?.label || 'JSON Parser'}</div>
                <div className="pill-connector" />
                <Handle type="target" position={Position.Left} />
                <Handle type="source" position={Position.Right} />
            </div>
        </div>
    )
}
