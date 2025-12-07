import React, { useEffect, useState } from 'react'
import FlowList from './components/FlowList'
import SidebarApps from './components/SidebarApps'
import CanvasArea from './components/CanvasArea'
import DrawerAppSelector from './components/DrawerAppSelector'
import NodeEditor from './components/NodeEditor'
import LogsPanel from './components/LogsPanel'
import ToolsDrawer from "./components/ToolsDrawer";
import AppPickerDrawer from "./components/AppPickerDrawer";
import useFlowsStore from './store/useFlowsStore'
import ActionPickerDrawer from "./components/ActionPickerDrawer";

export default function App() {
  const init = useFlowsStore(s => s.init)

  const [ready, setReady] = useState(false);

  useEffect(() => {
    init();              // Load flows
    setReady(true);      // Ensure children mount AFTER init
  }, []);

  if (!ready) return <div>Loading…</div>;

  return (
    <div className="wpaf-app-root">
      <aside className="left-column">
        <div className="top-logo">Bit-like Flows</div>
        <FlowList />
        <SidebarApps />
      </aside>

      <section className="center-column">
        <div className="topbar">
          <div className="flow-controls">
            <button onClick={() => useFlowsStore.getState().createFlow()}>+ New Flow</button>
            <button onClick={() => useFlowsStore.getState().cloneFlow()}>Clone Flow</button>
            <button onClick={() => useFlowsStore.getState().exportFlow()}>Export</button>
            <label className="import-btn">
              Import
              <input type="file" accept="application/json" onChange={(e) => useFlowsStore.getState().importFlowFile(e)} />
            </label>
          </div>
          <div className="right-actions">
            <button onClick={() => useFlowsStore.getState().saveCurrentFlow()}>Save</button>
            <button onClick={() => useFlowsStore.getState().runCurrentFlow()}>Test Flow Once</button>
          </div>
        </div>

        <CanvasArea />
      </section>

      <aside className="right-column">
        <ActionPickerDrawer />

        <DrawerAppSelector />
        <ToolsDrawer />
        <NodeEditor />

      </aside>
    </div>
  )
}
