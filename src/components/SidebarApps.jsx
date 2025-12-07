import React from 'react'
import useFlowsStore from '../store/useFlowsStore'
import { FaWpforms, FaMailchimp, FaClipboardList } from 'react-icons/fa'

const apps = [
  { id: 'cf7', name: 'Contact Form 7', icon: <FaWpforms /> },
  { id: 'mailchimp', name: 'Mailchimp', icon: <FaMailchimp /> },
  { id: 'mailchimpForms', name: 'Mailchimp Forms', icon: <FaClipboardList /> }
]

export default function SidebarApps() {
  const openPicker = (nodeId) => useFlowsStore.getState().openPickerForNode?.(nodeId) // not used, but kept
  const onDragStart = (e, app) => {
    e.dataTransfer.setData('application/json', JSON.stringify(app))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="apps-panel">
      <h4>Apps</h4>
      {apps.map(a => (
        <div key={a.id} className="app-card" draggable onDragStart={(e) => onDragStart(e, a)}>
          <div className="app-icon">{a.icon}</div>
          <div className="app-name">{a.name}</div>
        </div>
      ))}
      <button
        className="open-tools"
        onClick={() =>
          window.dispatchEvent(new CustomEvent("wpaf:open-tools", {
            detail: { type: "open-tools" }
          }))
        }
      >
        Tools
      </button>
    </div>
  )
}
