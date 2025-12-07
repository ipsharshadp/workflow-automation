import React, { useRef, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState
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
  tool_json: JsonNode
};

export default function CanvasArea() {
  const flow = useFlowsStore((s) => s.getCurrentFlow());
  const updateFlowElements = useFlowsStore((s) => s.updateCurrentFlowElements);

  const reactFlowWrapper = useRef(null);

  // store → ReactFlow initial load
  const initialNodes = flow?.elements?.filter((el) => el.data) || [];
  const initialEdges = flow?.elements?.filter((el) => el.source && el.target) || [];

  // RF states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /* ---------------------------------------------------
     ONLY UPDATE ZUSTAND WHEN RF NODES/EDGES CHANGE
     via user drag, connect, delete
  --------------------------------------------------- */
  const saveBackToStore = () => {
    const all = [...nodes, ...edges];
    updateFlowElements(all);
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        return newEdges;
      });

      setTimeout(saveBackToStore, 0);
    },
    [nodes, edges]
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
        y: e.clientY - bounds.top
      };

      // Add App
      if (payload?.id) {
        const newNode = {
          id: "n-" + Date.now(),
          type: "customPill",
          position,
          data: {
            label: payload.name,
            meta: { app: payload.id }
          }
        };

        setNodes((nds) => [...nds, newNode]);
        setTimeout(saveBackToStore, 0);
        return;
      }

      // Add Tool
      if (payload?.tool) {
        const t = payload.tool;

        const newNode = {
          id: "n-" + Date.now(),
          type: `tool_${t.type}`,
          position,
          data: {
            label: t.name,
            meta: { tool: t.id }
          }
        };

        setNodes((nds) => [...nds, newNode]);
        setTimeout(saveBackToStore, 0);
      }
    },
    [nodes]
  );

  /* ---------------------- UPDATE WHEN NODES CHANGE ---------------------- */
  useEffect(() => {
    // update Zustand ONLY when user finishes dragging
    if (nodes.length) {
      updateFlowElements([...nodes, ...edges]);
    }
  }, [nodes]);

  useEffect(() => {
    updateFlowElements([...nodes, ...edges]);
  }, [edges]);

  /* ---------------------- RENDER ---------------------- */
  if (!flow) return <div>No flow selected</div>;

  return (
    <div className="canvas-wrap" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => {
          onNodesChange(changes);
        }}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
