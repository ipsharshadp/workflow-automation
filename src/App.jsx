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
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function App() {
  const init = useFlowsStore(s => s.init)

  const [ready, setReady] = useState(false);

  useEffect(() => {
    init();              // Load flows
    setReady(true);      // Ensure children mount AFTER init
  }, []);

  if (!ready) return <div>Loading…</div>;

  return (
    <Container fluid>
      <Row>
        <Col xs={3} className='p-0'>
          <Row>
            <Col xs={12}>
              {/* <FlowList /> */}
              <SidebarApps />
            </Col>
          </Row>

        </Col>

        <Col xs={9}>
          <Row>
            <Col xs={12} className='mt-5'>
              <Button className='float-start' variant="outline-primary" onClick={() => useFlowsStore.getState().createFlow()}>+ New Flow</Button>
              <Button className='float-start ms-2' variant="outline-primary" onClick={() => useFlowsStore.getState().cloneFlow()}>Clone Flow</Button>
              <Button className='float-start ms-2' variant="outline-primary" onClick={() => useFlowsStore.getState().exportFlow()}>Export</Button>
              <Button className='float-start ms-2' variant="outline-primary" onClick={() => useFlowsStore.getState().importFlowFile()}>Import</Button>
              <Button className='float-start ms-2' variant="outline-primary" onClick={() => useFlowsStore.getState().saveCurrentFlow()}>Save</Button>
              <Button className='float-start ms-2' variant="outline-primary" onClick={() => useFlowsStore.getState().runCurrentFlow()}>Test Flow Once</Button>
            </Col>
            <Col xs={12}>
              <CanvasArea />
            </Col>
          </Row>

        </Col>
      </Row>
    </Container>
  )
}
