import React from 'react'
import useFlowsStore from '../store/useFlowsStore'

export default function NodeEditor() {
    const current = useFlowsStore(s => s.getCurrentFlow())
    const [selectedNodeId, setSelectedNodeId] = React.useState(null)
    const flowsState = useFlowsStore.getState()

    // register select function globally for node click to call
    React.useEffect(() => {
        window.__WPAF_SELECT_NODE__ = (id) => setSelectedNodeId(id)
        return () => { window.__WPAF_SELECT_NODE__ = null }
    }, [])

    React.useEffect(() => {
        // if selected node belongs to current flow ensure it exists
        if (!selectedNodeId) return
        const node = (current?.elements || []).find(n => n.id === selectedNodeId)
        if (!node) setSelectedNodeId(null)
    }, [current, selectedNodeId])

    if (!selectedNodeId) return null
    const node = (current?.elements || []).find(n => n.id === selectedNodeId)
    if (!node) return null

    const meta = node.data?.meta || {}

    const update = (patch) => {
        flowsState.updateNodeById(node.id, { data: { ...node.data, ...patch } })
    }

    return (
        <div className="node-editor">
            <div className="editor-head"><strong>Node</strong><button onClick={() => setSelectedNodeId(null)}>Close</button></div>
            <label>Title</label>
            <input value={node.data?.label || ''} onChange={(e) => update({ label: e.target.value })} />
            <label>App</label>
            <input value={meta.appName || meta.app || ''} readOnly />
            {meta.app === 'mailchimp' && (
                <>
                    <label>List ID</label>
                    <input value={meta.list || ''} onChange={(e) => flowsState.updateNodeById(node.id, { data: { meta: { ...meta, list: e.target.value } } })} />
                </>
            )}
            {meta.app === 'cf7' && (
                <>
                    <label>Form ID</label>
                    <input value={meta.formId || ''} onChange={(e) => flowsState.updateNodeById(node.id, { data: { meta: { ...meta, formId: e.target.value } } })} />
                </>
            )}
            <label>Expression (for Condition nodes)</label>
            <input value={meta.expr || ''} onChange={(e) => flowsState.updateNodeById(node.id, { data: { meta: { ...meta, expr: e.target.value } } })} />
            <div style={{ marginTop: 8 }}>
                <button onClick={() => { flowsState.saveCurrentFlow(); setSelectedNodeId(null) }}>Save Node</button>
            </div>
        </div>
    )
}
