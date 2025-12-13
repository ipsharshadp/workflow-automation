import React from 'react'
import useFlowsStore from '../store/useFlowsStore'

export default function LogsPanel() {
  const logs = useFlowsStore(s => s.logs)
  return (
    <div className="logs-panel">
      <div className="logs-head">Logs</div>
      <div className="logs-body">
        {logs.length === 0 ? <div className="log-empty">No logs</div> : logs.map((l, i) => <div key={i} className="log-line">{l}</div>)}
      </div>
    </div>
  )
}
