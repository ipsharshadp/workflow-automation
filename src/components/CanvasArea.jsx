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

  // derive initial nodes/edges from current flow (used only at mount or when flow id changes)
  const initialNodes = (flow?.elements || []).filter((el) => el.data) || [];
  const initialEdges = (flow?.elements || []).filter((el) => el.source && el.target) || [];

  // RF local states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /*
    IMPORTANT: only reset local RF states when the flow identity changes (not on every element mutation).
    Resetting on every elements change causes ReactFlow to remount nodes repeatedly and breaks click handlers.
  */
  useEffect(() => {
    const nodes = (flow?.elements || []).filter(e => e.data);
    const edges = (flow?.elements || []).filter(e => e.source && e.target);
    setNodes(nodes);
    setEdges(edges);
  }, [flow?.elements]);

  /* persist combined elements to store */
  const saveBackToStore = useCallback(() => {
    // Use the latest nodes/edges from state captured in this closure
    const all = [...nodes, ...edges];
    updateFlowElements(all);
  }, [nodes, edges, updateFlowElements]);

  /* ---------------- NODE / EDGE change handlers ---------------- */
  const onNodesChangeHandler = useCallback(
    (changes) => {
      // update local RF nodes
      setNodes((nds) => applyNodeChanges(changes, nds));

      // persist node changes to store nodes (Zustand setNodes accepts function or array)
      setNodesInStore((curNodes) => {
        const updated = applyNodeChanges(changes, curNodes);
        return updated;
      });

      // small debounce-ish persist of combined elements (works with latest nodes/edges)
      setTimeout(saveBackToStore, 0);
    },
    [setNodesInStore, saveBackToStore, setNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      // update local RF edges
      setEdges((eds) => applyEdgeChanges(changes, eds));

      // persist edges to store
      setEdgesInStore((curEdges) => {
        const updated = applyEdgeChanges(changes, curEdges);
        return updated;
      });

      setTimeout(saveBackToStore, 0);
    },
    [setEdgesInStore, saveBackToStore, setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      // add edge to local state
      setEdges((eds) => addEdge(params, eds));

      // persist to store edges as well (using function form)
      setEdgesInStore((curEdges) => addEdge(params, curEdges));

      // persist combined elements
      setTimeout(saveBackToStore, 0);
    },
    [setEdgesInStore, saveBackToStore, setEdges]
  );

  /* ---------------------- DRAG OVER ---------------------- */
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  /* ---------------------- DROP HANDLER ---------------------- */
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

      // prepare new node
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

      // Add new node to local state and persist to store.
      // We compute "currentEdges" from latest state variable rather than relying on a possibly stale closure.
      setNodes((nds) => {
        const next = [...nds, newNode];
        // persist nodes to store (function form)
        setNodesInStore(next);
        // persist full elements using current edges state (read edges from closure)
        setTimeout(() => updateFlowElements([...next, ...edges]), 0);
        return next;
      });
    },
    // we intentionally include edges here so that closure has latest value when drop occurs
    [edges, setNodesInStore, updateFlowElements]
  );

  /* ---------------------- RENDER ---------------------- */
  if (!flow) return <div>No flow selected</div>;

  return (
    <div className="canvas-wrap" ref={reactFlowWrapper} >
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
