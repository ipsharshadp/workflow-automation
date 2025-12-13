// src/components/nodes/DelayNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function DelayNode({ id, data }) {
    return (
        <div className="pill-node delay-node">
            <div className="pill-badge" style={{ background: '#fff7ed', color: '#92400e' }}>Delay</div>
            <div className="pill-container">
                <div className="pill-left" style={{ background: '#fff7ed' }}><div className="pill-icon">⏱</div></div>
                <div className="pill-text">{data?.label || 'Delay'}</div>
                <div className="pill-connector" />
                <Handle type="target" position={Position.Left} />
                <Handle type="source" position={Position.Right} />
            </div>
        </div>
    )
}
