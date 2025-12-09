// src/components/CanvasArea.jsx
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

  // initial snapshot used to initialise RF local state
  const initialNodes = (flow?.elements || []).filter((el) => el.data) || [];
  const initialEdges = (flow?.elements || []).filter((el) => el.source && el.target) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (!flow) return;

    const storeNodes = flow.elements.filter(e => e.data);
    const storeEdges = flow.elements.filter(e => e.source && e.target);

    // Only update if different length OR changed ids
    const nodesChanged =
      storeNodes.length !== nodes.length ||
      storeNodes.some((n, i) => n.id !== nodes[i]?.id);

    const edgesChanged =
      storeEdges.length !== edges.length ||
      storeEdges.some((e, i) => e.id !== edges[i]?.id);

    if (nodesChanged) {
      setNodes(storeNodes);
    }
    if (edgesChanged) {
      setEdges(storeEdges);
    }
  }, [flow?.elements]);

  const saveBackToStore = useCallback(() => {
    const all = [...nodes, ...edges];
    updateFlowElements(all);
  }, [nodes, edges, updateFlowElements]);

  const onNodesChangeHandler = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      setNodesInStore((curNodes) => {
        const updated = applyNodeChanges(changes, curNodes);
        return updated;
      });
      setTimeout(saveBackToStore, 0);
    },
    [setNodesInStore, saveBackToStore]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      setEdgesInStore((curEdges) => {
        const updated = applyEdgeChanges(changes, curEdges);
        return updated;
      });
      setTimeout(saveBackToStore, 0);
    },
    [setEdgesInStore, saveBackToStore]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      setEdgesInStore((curEdges) => addEdge(params, curEdges));
      setTimeout(saveBackToStore, 0);
    },
    [setEdgesInStore, saveBackToStore]
  );

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
      let newNode;
      if (payload?.id) {
        newNode = {
          id,
          type: "customPill",
          position,
          data: {
            label: payload.name,
            meta: { app: payload.id },
          },
        };
      } else if (payload?.tool) {
        const t = payload.tool;
        newNode = {
          id,
          type: `tool_${t.type}`,
          position,
          data: {
            label: t.name,
            meta: { tool: t.id },
          },
        };
      } else {
        return;
      }

      // add to local nodes and persist; read edges from current state closure
      setNodes((nds) => {
        const next = [...nds, newNode];
        setNodesInStore(next);
        setTimeout(() => updateFlowElements([...next, ...edges]), 0);
        return next;
      });
    },
    [edges, setNodesInStore, updateFlowElements]
  );

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
        <Controls className="Controls" />
        <Background />
      </ReactFlow>
    </div>
  );
}
