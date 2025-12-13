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
import MakeRequestModal from './components/modal/MakeRequestModal';




export default function App() {
  const init = useFlowsStore(s => s.init)
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [showAppConfigModal, setShowAppConfigModal] = useState(false);
  const [nodeData, setNodeData] = useState(null);

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
      const nodeId = e.detail.id;
      const store = useFlowsStore.getState();
      store.deleteNodeById(nodeId);

      // const store = useFlowsStore.getState();
      // const flow = store.getCurrentFlow();

      // const elements = flow.elements;

      // // find parent and child of this node
      // const parentEdge = elements.find(el => el.target === id);
      // const childEdge = elements.find(el => el.source === id);

      // // remove node + its edges
      // let newElements = elements.filter(el =>
      //   el.id !== id &&
      //   el.source !== id &&
      //   el.target !== id
      // );

      // // auto reconnect parent → child
      // if (parentEdge && childEdge) {
      //   newElements.push({
      //     id: "e-reconnect-" + Date.now(),
      //     source: parentEdge.source,
      //     target: childEdge.target
      //   });
      // }

      // store.updateCurrentFlowElements(newElements);
    };
    window.addEventListener("wpaf:delete-node", deleteNode);
    return () => window.removeEventListener("wpaf:delete-node", deleteNode);
  }, []);

  useEffect(() => {
    const addBranch = (e) => {
      const routerId = e.detail.routerId;
      const store = useFlowsStore.getState();
      store.createRouterBranch(routerId);
    };

    window.addEventListener("router:add-branch", addBranch);
    return () => window.removeEventListener("router:add-branch", addBranch);
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

  // add this single useEffect for condition events
  useEffect(() => {
    const store = useFlowsStore.getState();

    const onAddRule = (e) => {
      // ConditionNode dispatches { detail: { nodeId } }
      store.addConditionRule(e.detail.nodeId);
    };

    const onDeleteRule = (e) => {
      // ConditionNode dispatches { detail: { nodeId, ruleId } }
      store.deleteConditionRule(e.detail.nodeId, e.detail.ruleId);
    };

    const onAddNodeUnderRule = (e) => {
      // ConditionNode dispatches { detail: { conditionNodeId, ruleId } }
      store.addNodeUnderConditionRule(e.detail.conditionNodeId, e.detail.ruleId);
    };

    const onAddFallback = (e) => {
      // ConditionNode dispatches { detail: { nodeId } }
      store.addConditionFallback(e.detail.nodeId);
    };

    window.addEventListener("condition:add-rule", onAddRule);
    window.addEventListener("condition:delete-rule", onDeleteRule);
    window.addEventListener("condition:add-node-under-rule", onAddNodeUnderRule);
    window.addEventListener("condition:add-fallback", onAddFallback);

    return () => {
      window.removeEventListener("condition:add-rule", onAddRule);
      window.removeEventListener("condition:delete-rule", onDeleteRule);
      window.removeEventListener("condition:add-node-under-rule", onAddNodeUnderRule);
      window.removeEventListener("condition:add-fallback", onAddFallback);
    };
  }, []);

  useEffect(() => {
    const onDropOnNode = (e) => {
      const { parentId, payload } = e.detail;
      const store = useFlowsStore.getState();

      if (!payload) return;

      if (payload.type === "app") {
        // create an app node after parentId (will remove parent's outgoing edge)
        store.createToolNodeAfter(parentId, payload.data);
        return;
      }

      if (payload.type === "tool") {
        const tool = payload.data;
        if (tool.type === "router") {
          store.createRouterNodeAfter(parentId, tool);
        } else if (tool.type === "condition") {
          store.createConditionNodeAfter(parentId, tool);
        } else {
          store.createToolNodeAfter(parentId, tool);
        }
        return;
      }

      // fallback: create a normal pill
      store.createToolNodeAfter(parentId, { id: payload.data.id, name: payload.data.name || payload.data.id });
    };

    window.addEventListener("wpaf:drop-on-node", onDropOnNode);
    return () => window.removeEventListener("wpaf:drop-on-node", onDropOnNode);
  }, []);

  useEffect(() => {
    const onConfigNodeSettings = (e) => {
      const { id, data } = e.detail;
      setNodeData(data);
      setNodeId(id);
      console.log("onConfigNodeSettings", id, data);
      const appType = data.meta?.tool;
      switch (appType) {
        case "http_request":
          setShowAppConfigModal(true);
          break;
        default:
          break;
      }
      // const store = useFlowsStore.getState();
      // store.updateToolNodeSettings(id, data);
    };

    window.addEventListener("wpaf:config-node-settings", onConfigNodeSettings);
    return () => window.removeEventListener("wpaf:config-node-settings", onConfigNodeSettings);
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
      <MakeRequestModal show={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} nodeId={nodeId} nodeData={nodeData} />
    </Container>
  )
}
