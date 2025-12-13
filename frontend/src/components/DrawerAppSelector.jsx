import React from 'react'
import useFlowsStore from '../store/useFlowsStore'
import { FaWpforms, FaMailchimp, FaClipboardList } from 'react-icons/fa'

const apps = [
  { id: 'cf7', name: 'Contact Form 7', icon: <FaWpforms /> },
  { id: 'mailchimp', name: 'Mailchimp', icon: <FaMailchimp /> },
  { id: 'mailchimpForms', name: 'Mailchimp Forms', icon: <FaClipboardList /> }
]

export default function DrawerAppSelector() {
  const [drawer, setDrawer] = React.useState({ open: false, nodeId: null })
  // We'll use global window event to trigger open when user clicks node - simpler than global store
  React.useEffect(() => {
    const h = (e) => {
      if (e.detail && e.detail.type === 'open-app-picker') {
        setDrawer({ open: true, nodeId: e.detail.nodeId })
      }
    }
    window.addEventListener('wpaf:open-app-picker', h)
    return () => window.removeEventListener('wpaf:open-app-picker', h)
  }, [])

  const close = () => setDrawer({ open: false, nodeId: null })
  const assign = (app) => {
    if (!drawer.nodeId) return
    useFlowsStore.getState().setNodeAppById(drawer.nodeId, app)
    close()
  }

  if (!drawer.open) return null
  return (
    <div className="drawer">
      <div className="drawer-head"><strong>Select an app</strong><button onClick={close}>✕</button></div>
      <div className="drawer-list">
        {apps.map(a => (
          <div key={a.id} className="drawer-item" onClick={() => assign(a)}>
            <div className="drawer-item-left">{a.icon}</div>
            <div>
              <div className="drawer-item-title">{a.name}</div>
              <div className="drawer-item-sub">Add {a.name} step</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
