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
  const deleteFlow = useFlowsStore(s => s.deleteFlow)

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

  useEffect(() => {
    const deleteNode = (e) => {
      const id = e.detail.id;
      console.log("deleteNode", id);
      //deleteFlow(id);
      const store = useFlowsStore.getState();
      const flow = store.getCurrentFlow();
      console.log("flow", flow);

      // const newElements = flow.elements.filter(el => el.id !== id && el.source !== id && el.target !== id);
      let newElements = flow.elements.filter((el) => el.id !== id);
      store.updateCurrentFlowElements(newElements);
    };

    window.addEventListener("wpaf:delete-node", deleteNode);
    return () => window.removeEventListener("wpaf:delete-node", deleteNode);
  }, []);

  useEffect(() => {

    const addNodeAfter = (e) => {
      const parentId = e.detail.parentId;

      // Open picker, but mark that it is "new node" mode
      setNodeId(parentId);
      window._addingNewNode = true;
      setShow(true);
    };

    window.addEventListener("wpaf:add-node-after", addNodeAfter);
    return () => window.removeEventListener("wpaf:add-node-after", addNodeAfter);

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
