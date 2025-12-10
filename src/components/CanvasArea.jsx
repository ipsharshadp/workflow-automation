import React, { useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import useFlowsStore from "../store/useFlowsStore";
import PillNode from "./nodes/PillNode";
import ConditionNode from "./nodes/ConditionNode";
import RouterNode from "./nodes/RouterNode";
import DelayNode from "./nodes/DelayNode";
import JsonNode from "./nodes/JsonNode";

const nodeTypes = {
  customPill: PillNode,
  tool_condition: ConditionNode,
  tool_router: RouterNode,
  tool_delay: DelayNode,
  tool_json: JsonNode,
};

export default function CanvasArea() {
  const flow = useFlowsStore((s) => s.getCurrentFlow());
  const updateFlowElements = useFlowsStore((s) => s.updateCurrentFlowElements);
  const setNodesInStore = useFlowsStore((s) => s.setNodes);
  const setEdgesInStore = useFlowsStore((s) => s.setEdges);

  const reactFlowWrapper = useRef(null);

  const initialNodes = (flow?.elements || []).filter((el) => el.data) || [];
  const initialEdges = (flow?.elements || []).filter((el) => el.source && el.target) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 🔥 REAL-TIME, SAFE SYNC
  useEffect(() => {
    if (!flow?.elements) return;

    const storeNodes = flow.elements
      .filter((e) => e.data)
      .slice()
      .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0));

    const storeEdges = flow.elements.filter((e) => e.source && e.target);

    const nodeIdsChanged =
      storeNodes.map((n) => n.id).join("|") !== nodes.map((n) => n.id).join("|");

    const labelsChanged = storeNodes.some((n) => {
      const local = nodes.find((ln) => ln.id === n.id);
      return local && local.data?.label !== n.data?.label;
    });

    const edgeIdsChanged =
      storeEdges.map((e) => e.id).join("|") !== edges.map((e) => e.id).join("|");

    if (nodeIdsChanged || labelsChanged) setNodes(storeNodes);
    if (edgeIdsChanged) setEdges(storeEdges);
  }, [flow?.elements]);

  // HANDLERS ----------------------------------------------------------
  const saveToStore = useCallback(() => {
    updateFlowElements([...nodes, ...edges]);
  }, [nodes, edges, updateFlowElements]);

  const onNodesChangeHandler = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      //setNodesInStore((prev) => applyNodeChanges(changes, prev));
      //setTimeout(saveToStore, 0);
    },
    [setNodesInStore, saveToStore]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      //setEdgesInStore((prev) => applyEdgeChanges(changes, prev));
      //setTimeout(saveToStore, 0);
    },
    [setEdgesInStore, saveToStore]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      //setEdgesInStore((prev) => addEdge(params, prev));
      //setTimeout(saveToStore, 0);
    },
    [setEdgesInStore, saveToStore]
  );

  // DRAG / DROP --------------------------------------------------------
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;

      const payload = JSON.parse(raw);

      const position = {
        x: e.clientX - bounds.left - 80,
        y: e.clientY - bounds.top,
      };

      const id = "n-" + Date.now();

      const newNode = {
        id,
        type: "customPill",
        position,
        data: {
          label: payload.name,
          meta: { app: payload.id },
        },
      };

      setNodes((nds) => {
        const updated = [...nds, newNode];
        //setNodesInStore(updated);
        //setTimeout(() => updateFlowElements([...updated, ...edges]), 0);
        return updated;
      });
    },
    [edges, setNodesInStore, updateFlowElements]
  );

  // RENDER --------------------------------------------------------------
  if (!flow) return <div>No flow selected</div>;

  return (
    <div className="canvas-wrap" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
