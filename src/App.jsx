import React, { useEffect, useState } from 'react'
import SidebarApps from './components/SidebarApps'
import CanvasArea from './components/CanvasArea'
import useFlowsStore from './store/useFlowsStore'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ActionPickerModal from './components/modal/ActionPickerModal';



export default function App() {
  const init = useFlowsStore(s => s.init)
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [nodeId, setNodeId] = useState(null);

  useEffect(() => {
    init();              // Load flows
    setReady(true);      // Ensure children mount AFTER init
  }, []);
  useEffect(() => {
    const openModal = (e) => {
      setNodeId(e.detail.nodeId);
      setShow(true);
    };

    window.addEventListener("wpaf:open-action-picker", openModal);
    return () => window.removeEventListener("wpaf:open-action-picker", openModal);
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
      <ActionPickerModal
        show={show}
        onHide={() => setShow(false)}
        nodeId={nodeId}
      />

    </Container>
  )
}
