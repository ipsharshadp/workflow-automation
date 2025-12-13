// src/components/ToolsDrawer.jsx
import React, { useState, useEffect } from 'react'
import tools from '../data/tools'
import useFlowsStore from '../store/useFlowsStore'

export default function ToolsDrawer() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const addNodeToFlow = useFlowsStore(s => s.updateCurrentFlowElements)

    useEffect(() => {
        const handler = (e) => {
            if (e.detail && e.detail.type === 'open-tools') {
                setOpen(true)
            }
        }
        window.addEventListener('wpaf:open-tools', handler)
        return () => window.removeEventListener('wpaf:open-tools', handler)
    }, [])

    const filtered = tools.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase()))

    const onClickAdd = (t) => {
        // create a node at default position; accurate positioning on drop would be nicer but for click add we add offset
        const node = {
            id: 'n-' + Date.now(),
            type: `tool_${t.type}`,
            position: { x: 520 + Math.random() * 120, y: 140 + Math.random() * 140 },
            data: { label: t.name, meta: { tool: t.id, title: t.name } }
        }
        const cur = useFlowsStore.getState().getCurrentFlow()
        const elements = [...(cur.elements || []), node]
        useFlowsStore.getState().updateCurrentFlowElements(elements)
        setOpen(false)
    }

    const onDragStart = (e, t) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ tool: t }))
        e.dataTransfer.effectAllowed = 'copy'
    }

    if (!open) return null

    return (
        <div className="tools-drawer">
            <div className="tools-head">
                <button onClick={() => setOpen(false)}>✕</button>
                <h3>Tools</h3>
            </div>

            <div style={{ padding: '8px' }}>
                <input
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}
                />
            </div>

            <div style={{ padding: 12, maxHeight: '60vh', overflow: 'auto' }}>
                {filtered.map(t => {
                    const Icon = t.icon
                    return (
                        <div key={t.id} className="tools-item" draggable onDragStart={(e) => onDragStart(e, t)}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
                                <div className="tools-icon"><Icon /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{t.name} {t.pro && <span className="pro-badge">Pro</span>}</div>
                                    <div style={{ fontSize: 13, color: '#6b7280' }}>{t.desc}</div>
                                </div>

                                <div>
                                    <button onClick={() => onClickAdd(t)} className="tools-add-btn">Add</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
