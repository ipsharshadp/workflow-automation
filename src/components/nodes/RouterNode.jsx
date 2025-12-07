// src/components/nodes/RouterNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function RouterNode({ id, data }) {
    return (
        <div className="pill-node router-node">
            <div className="pill-badge" style={{ background: '#fff7ed', color: '#92400e' }}>Router</div>
            <div className="pill-container">
                <div className="pill-left" style={{ background: '#fff7ed' }}><div className="pill-icon">≡</div></div>
                <div className="pill-text">{data?.label || 'Router'}</div>
                <div className="pill-connector" />
                <Handle type="target" position={Position.Left} />
                <Handle type="source" position={Position.Right} />
            </div>
        </div>
    )
}
