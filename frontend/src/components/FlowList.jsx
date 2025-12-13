import React from 'react'
import useFlowsStore from '../store/useFlowsStore'

export default function FlowList() {
    const flows = useFlowsStore(s => s.flows)
    const current = useFlowsStore(s => s.currentFlowId)
    const switchFlow = useFlowsStore(s => s.switchFlow)
    const deleteFlow = useFlowsStore(s => s.deleteFlow)
    const save = useFlowsStore(s => s.saveCurrentFlow)

    return (
        <div className="flow-list">
            <div className="flow-list-head">Flows</div>
            <div className="flow-list-body">
                {flows.map(f => (
                    <div key={f.id} className={`flow-item ${f.id === current ? 'active' : ''}`} onClick={() => switchFlow(f.id)}>
                        <div className="flow-title">{f.title}</div>
                        <div className="flow-actions">
                            <button title="Delete" onClick={(e) => { e.stopPropagation(); deleteFlow(f.id); }}>🗑</button>
                            <button title="Save" onClick={(e) => { e.stopPropagation(); save(); }}>💾</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
