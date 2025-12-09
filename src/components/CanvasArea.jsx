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

  // derive initial nodes/edges from current flow
  const initialNodes = (flow?.elements || []).filter((el) => el.data) || [];
  const initialEdges = (flow?.elements || []).filter((el) => el.source && el.target) || [];

  // RF states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // keep ReactFlow in-sync when flow changes externally (e.g., load/import)
  useEffect(() => {
    // update local RF states to reflect store flow
    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow?.id]); // only when flow identity changes

  /* persist combined elements to store */
  const saveBackToStore = useCallback(() => {
    const all = [...nodes, ...edges];
    updateFlowElements(all);
  }, [nodes, edges, updateFlowElements]);

  const onNodesChangeHandler = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      // persist nodes to Zustand
      setNodesInStore((curNodes) => {
        const updated = applyNodeChanges(changes, curNodes);
        return updated;
      });
      // small debounce-ish persist of combined elements
      setTimeout(saveBackToStore, 0);
    },
    [setNodesInStore, saveBackToStore]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      // persist edges to Zustand
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
      // persist to store edges as well
      setEdgesInStore((curEdges) => {
        const next = addEdge(params, curEdges);
        return next;
      });
      setTimeout(saveBackToStore, 0);
    },
    [setEdgesInStore, saveBackToStore]
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

      // Add App (payload.id present)
      if (payload?.id) {
        const newNode = {
          id: "n-" + Date.now(),
          type: "customPill",
          position,
          data: {
            label: payload.name,
            meta: { app: payload.id },
          },
        };

        setNodes((nds) => {
          const next = [...nds, newNode];
          // persist to store nodes
          setNodesInStore(next);
          setTimeout(() => updateFlowElements([...next, ...edges]), 0);
          return next;
        });

        return;
      }

      // Add Tool (payload.tool present)
      if (payload?.tool) {
        const t = payload.tool;

        const newNode = {
          id: "n-" + Date.now(),
          type: `tool_${t.type}`,
          position,
          data: {
            label: t.name,
            meta: { tool: t.id },
          },
        };

        setNodes((nds) => {
          const next = [...nds, newNode];
          setNodesInStore(next);
          setTimeout(() => updateFlowElements([...next, ...edges]), 0);
          return next;
        });
      }
    },
    // edges is read-only snapshot here — that's fine; updates will persist on edges change
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
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
