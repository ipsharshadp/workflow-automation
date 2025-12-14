// src/store/useFlowsStore.js
import { create } from "zustand";
import { nanoid } from "nanoid";

const LS_KEY = "wpaf_flows_v1";

/* -------------------- DEFAULT FLOW -------------------- */
const createDefaultFlow = () => ({
  id: "flow-" + nanoid(),
  title: "Untitled Flow",
  elements: [
    {
      id: "n-" + nanoid(),
      type: "customPill",
      position: { x: 220, y: 180 },
      data: { label: "Select an app", meta: { isTrigger: true, isFirstNode: true } },
    },
  ],
  createdAt: Date.now(),
});

// const sortNodes = (nodes) =>
//   nodes.slice().sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0));

const sortNodes = (nodes) => nodes;

const separate = (elements) => {
  const nodes = elements.filter((e) => e.data);
  const edges = elements.filter((e) => e.source && e.target);
  return { nodes, edges };
};



/* -------------------- STORAGE HELPERS -------------------- */

function loadAll() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (e) {
    console.error("loadAll error", e);
    return [];
  }
}

function saveAll(flows) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(flows));
  } catch (e) {
    console.error("saveAll error", e);
  }
}

/* -------------------- STORE -------------------- */

const useFlowsStore = create((set, get) => ({
  flows: [],
  currentFlowId: null,
  logs: [],

  /* -------------------- INIT -------------------- */
  init: () => {
    let flows = loadAll();

    // If no flows exist → create fresh default
    if (!flows.length) {
      const df = createDefaultFlow();
      flows = [df];
      saveAll(flows);
    }

    // If first flow has no elements → force fix
    if (!flows[0].elements || !flows[0].elements.length) {
      flows[0].elements = createDefaultFlow().elements;
      saveAll(flows);
    }

    set({
      flows,
      currentFlowId: flows[0].id,
    });
  },

  /* -------------------- HELPERS -------------------- */

  getCurrentFlow: () => {
    const { flows, currentFlowId } = get();
    return flows.find((f) => f.id === currentFlowId) || null;
  },

  switchFlow: (id) => {
    set({ currentFlowId: id });
  },

  /* -------------------- CREATE NEW FLOW -------------------- */
  createFlow: (title) => {
    const f = createDefaultFlow();
    f.title = title || "New Flow";

    set((state) => {
      const flows = [f, ...state.flows];
      saveAll(flows);
      return { flows, currentFlowId: f.id };
    });
  },
  updateFlowTitle: (id, title) => {
    set((state) => {
      const flows = state.flows.map((f) => {
        if (f.id !== id) return f;
        return { ...f, title };
      });
      saveAll(flows);
      return { flows };
    });
  },

  /* -------------------- DELETE FLOW -------------------- */
  deleteFlow: (id) => {
    set((state) => {
      let flows = state.flows.filter((f) => f.id !== id);

      // Always keep at least 1 flow
      if (!flows.length) {
        const df = createDefaultFlow();
        flows = [df];
      }

      saveAll(flows);
      return { flows, currentFlowId: flows[0].id };
    });
  },

  /* -------------------- UPDATE ENTIRE ELEMENT LIST -------------------- */

  // updateCurrentFlowElements: (elements) => {
  //   set((state) => {
  //     const flows = state.flows.map((f) => {
  //       if (f.id !== state.currentFlowId) return f;
  //       return { ...f, elements };
  //     });
  //     saveAll(flows);
  //     return { flows };
  //   });
  // },


  updateCurrentFlowElements: (elements) => {
    const { flows, currentFlowId } = get();
    // Split
    let { nodes, edges } = separate(elements);
    // Sort nodes for deterministic ordering
    nodes = sortNodes(nodes);

    const newElements = [...nodes, ...edges];

    const updatedFlows = flows.map((f) => {
      const updatedFlow = f.id === currentFlowId ? { ...f, elements: newElements } : f
      return updatedFlow
    });
    saveAll(updatedFlows);
    set({ flows: updatedFlows });
  },


  /* -------------------- SAFE UPDATE NODE -------------------- */

  updateNodeById: (nodeId, patch) => {
    set((state) => {
      const flows = state.flows.map((f) => {
        if (f.id !== state.currentFlowId) return f;

        const elements = f.elements.map((el) => {
          if (el.id !== nodeId) return el;

          return {
            ...el,
            data: { ...el.data, ...(patch.data || {}) },
            position: patch.position ? patch.position : el.position,
          };
        });

        return { ...f, elements };
      });

      saveAll(flows);
      return { flows };
    });
  },

  /* -------------------- ASSIGN APP TO NODE -------------------- */

  setNodeAppById: (nodeId, app) => {
    set((state) => {
      console.log("setNodeAppById", nodeId, app);
      const flows = state.flows.map((f) => {
        if (f.id !== state.currentFlowId) return f;

        const elements = f.elements.map((el) => {
          if (el.id !== nodeId) return el;

          return {
            ...el,
            data: {
              ...el.data,
              label: app.name,
              meta: {
                ...(el.data?.meta || {}),
                app: app.id,
                appName: app.name,
                kind: app.type,
              },
            },
          };
        });

        return { ...f, elements };
      });

      saveAll(flows);
      return { flows };
    });
  },

  /* -------------------- SET NODES (Used by ReactFlow) -------------------- */

  // setNodes: (incoming) => {
  //   console.log("setNodes", incoming);
  //   const { currentFlowId, flows } = get();
  //   console.log("currentFlowId", currentFlowId);
  //   console.log("flows", flows);
  //   const updatedFlows = flows.map((f) => {
  //     if (f.id !== currentFlowId) return f;
  //     console.log("f", f);

  //     const prevNodes = f.elements.filter((e) => e.data); // existing nodes
  //     const edges = f.elements.filter((e) => e.source && e.target);
  //     console.log("prevNodes", prevNodes);
  //     console.log("edges", edges);
  //     // Incoming can be array OR function
  //     const nextNodes =
  //       typeof incoming === "function"
  //         ? incoming(prevNodes)
  //         : incoming;

  //     return { ...f, elements: [...nextNodes, ...edges] };
  //   });

  //   saveAll(updatedFlows);
  //   set({ flows: updatedFlows });
  // },

  setNodes: (incoming) => {
    const { currentFlowId, flows } = get();

    const updated = flows.map(f => {
      if (f.id !== currentFlowId) return f;

      const nodes = typeof incoming === "function"
        ? incoming(f.elements.filter(e => e.data))
        : incoming;

      const edges = f.elements.filter(e => e.source && e.target);

      return { ...f, elements: [...nodes, ...edges] };
    });

    set({ flows: updated });
    saveAll(updated);
  },

  /* -------------------- SET EDGES (Used by ReactFlow) -------------------- */

  // setEdges: (incoming) => {
  //   const { currentFlowId, flows } = get();

  //   const updatedFlows = flows.map((f) => {
  //     if (f.id !== currentFlowId) return f;

  //     const prevEdges = f.elements.filter((e) => e.source && e.target);
  //     const nodes = f.elements.filter((e) => e.data);

  //     const nextEdges =
  //       typeof incoming === "function"
  //         ? incoming(prevEdges)
  //         : incoming;

  //     return { ...f, elements: [...nodes, ...nextEdges] };
  //   });

  //   saveAll(updatedFlows);
  //   set({ flows: updatedFlows });
  // },

  setEdges: (incoming) => {
    const { currentFlowId, flows } = get();

    const updated = flows.map(f => {
      if (f.id !== currentFlowId) return f;

      const edges = typeof incoming === "function"
        ? incoming(f.elements.filter(e => e.source && e.target))
        : incoming;

      const nodes = f.elements.filter(e => e.data);

      return { ...f, elements: [...nodes, ...edges] };
    });

    set({ flows: updated });
    saveAll(updated);
  },

  /* -------------------- EXPORT -------------------- */

  exportFlow: () => {
    const cur = get().getCurrentFlow();
    if (!cur) return;

    const blob = new Blob([JSON.stringify(cur, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${cur.title || "flow"}.json`;
    a.click();

    get().addLog("Exported flow");
  },

  /* -------------------- IMPORT -------------------- */

  importFlowFile: async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const obj = JSON.parse(text);

      obj.id = obj.id || "flow-" + nanoid();

      set((state) => {
        const flows = [obj, ...state.flows];
        saveAll(flows);
        return { flows, currentFlowId: obj.id };
      });

      get().addLog("Imported flow");
    } catch (err) {
      get().addLog("Import failed: bad JSON");
    }

    e.target.value = "";
  },

  /* -------------------- LOGGING -------------------- */

  addLog: (line) =>
    set((state) => ({
      logs: [...state.logs, `${new Date().toLocaleTimeString()} - ${line}`],
    })),

  /* -------------------- CLEAR ALL -------------------- */

  clearAllData: () => {
    localStorage.removeItem(LS_KEY);
    const fresh = createDefaultFlow();
    set({ flows: [fresh], currentFlowId: fresh.id, logs: [] });
  },

  setNodeConditionsById: (nodeId, conditions) => {
    set((state) => {
      const flows = state.flows.map((f) => {
        if (f.id !== state.currentFlowId) return f;

        const elements = f.elements.map((el) => {
          if (el.id !== nodeId) return el;

          return {
            ...el,
            data: {
              ...el.data,
              meta: {
                ...el.data?.meta,
                conditions,
              },
            },
          };
        });

        return { ...f, elements };
      });

      saveAll(flows);
      return { flows };
    });
  },

  // createToolNodeAfter: (nodeId, tool) => {
  //   const { flows, currentFlowId } = get();
  //   const flow = flows.find((f) => f.id === currentFlowId);
  //   if (!flow) return;

  //   const parent = flow.elements.find((n) => n.id === nodeId);
  //   if (!parent) return;

  //   // If parent has no position, set default x/y
  //   const parentPos = parent.position || { x: 0, y: 0 };

  //   const newNode = {
  //     id: "n-" + nanoid(),
  //     type: `tool_${tool.type}`,
  //     position: { x: parentPos.x + 240, y: parentPos.y },
  //     data: { label: tool.name, meta: { tool: tool.id } },
  //   };

  //   const newEdge = {
  //     id: "e-" + nanoid(),
  //     source: nodeId,
  //     target: newNode.id,
  //   };

  //   const updated = [...flow.elements, newNode, newEdge];

  //   get().updateCurrentFlowElements(updated);
  // },
  createRouterNodeAfter: (parentId, tool) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find((f) => f.id === currentFlowId);
    if (!flow) return;

    const parent = flow.elements.find((n) => n.id === parentId);
    if (!parent) return;

    const p = parent.position || { x: 0, y: 0 };

    const newNode = {
      id: "n-" + nanoid(),
      type: "tool_router",
      position: { x: p.x + 260, y: p.y },
      data: {
        label: "Router",
        meta: {
          tool: tool.id,
          router: true,
          branches: [],  // prepare for IF/ELSE structure
        },
      },
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: parentId,
      target: newNode.id,
    };

    // normal nodes: remove previous outgoing edges
    const cleaned = flow.elements.filter(el => el.source !== parentId);

    get().updateCurrentFlowElements([...cleaned, newNode, newEdge]);
  },

  createToolNodeAfter: (nodeId, tool) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find((f) => f.id === currentFlowId);
    if (!flow) return;

    const parent = flow.elements.find((n) => n.id === nodeId);
    if (!parent) return;

    const parentPos = parent.position || { x: 0, y: 0 };

    // NEW NODE POSITION (vertical chain)
    const newNode = {
      id: "n-" + nanoid(),
      type: `customPill`,
      position: {
        x: parentPos.x,
        y: parentPos.y + 140
      },
      data: {
        label: tool.name,
        meta: { tool: tool.id, type: tool.type },
      },
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: nodeId,
      target: newNode.id,
    };

    // REMOVE existing outgoing edges → enforce linear chain
    const cleaned = flow.elements.filter(el => el.source !== nodeId);

    const updated = [...cleaned, newNode, newEdge];

    get().updateCurrentFlowElements(updated);
  },
  /* ---------------------------------------------
   DELETE NODE (auto reconnect chain)
---------------------------------------------*/
  deleteNodeById: (nodeId) => {
    const flow = get().getCurrentFlow();
    if (!flow) return;

    const elements = [...flow.elements];

    const parentEdge = elements.find((el) => el.target === nodeId);
    const childEdge = elements.find((el) => el.source === nodeId);
    // remove node + its edges
    let newElements = elements.filter(
      (el) => el.id !== nodeId && el.source !== nodeId && el.target !== nodeId
    );



    // reconnect chain if middle node removed
    if (parentEdge && childEdge) {
      newElements.push({
        id: "e-" + nanoid(),
        source: parentEdge.source,
        target: childEdge.target
      });
    }
    get().updateCurrentFlowElements(newElements);
  },
  createRouterBranch: (routerId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find((f) => f.id === currentFlowId);
    if (!flow) return;

    // find router node
    const router = flow.elements.find((n) => n.id === routerId);
    if (!router) return;

    const pos = router.position || { x: 0, y: 0 };

    // how many branches already exist (outgoing edges)
    const siblings = flow.elements.filter((e) => e.source === routerId).length;

    // AUTO-LAYOUT: new branch appears staggered vertically
    const newNode = {
      id: "n-" + nanoid(),
      type: "customPill",          // branch is a normal pill node
      position: {
        x: pos.x + 260,            // right of router
        y: pos.y + 150 + siblings * 120, // each branch 120px lower
      },
      data: {
        label: `Branch ${siblings + 1}`,
        meta: {
          routerBranch: true,
        },
      },
    };

    // Create new edge (router → branch)
    const newEdge = {
      id: "e-" + nanoid(),
      source: routerId,
      target: newNode.id,
    };

    // IMPORTANT: Unlike normal nodes, router keeps existing branches
    const updated = [...flow.elements, newNode, newEdge];

    get().updateCurrentFlowElements(updated);
  },

  addConditionRule: (nodeId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    const node = flow.elements.find(n => n.id === nodeId);
    if (!node) return;

    // 1) create rule
    const rule = { id: "cond-" + nanoid(), label: "Untitled Condition" };

    // 2) determine index for positioning
    const existingRules = node.data.meta.conditions || [];
    const ruleIndex = existingRules.length;

    // 3) create branch node
    const newBranchNode = {
      id: "n-" + nanoid(),
      type: "customPill",
      position: {
        x: node.position.x + 300,
        y: node.position.y + 100 + ruleIndex * 100,
      },
      data: {
        label: rule.label,
        meta: { conditionRuleId: rule.id },
      },
    };

    // 4) set branch id on rule (so UI can reference it directly later)
    rule.branchNodeId = newBranchNode.id;

    // 5) push rule into condition node meta (after branch id assigned)
    node.data.meta.conditions = [...existingRules, rule];

    // 6) create edge FROM specific handle on condition node → branch node
    const newEdge = {
      id: "e-" + nanoid(),
      source: nodeId,
      sourceHandle: `rule-${rule.id}`, // <--- IMPORTANT: attach to the rule handle
      target: newBranchNode.id,
    };

    // 7) persist
    get().updateCurrentFlowElements([...flow.elements, newBranchNode, newEdge]);
  },


  // in useFlowsStore.js — replace createConditionBranch
  createConditionBranch: (conditionNodeId, ruleId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    const node = flow.elements.find(n => n.id === conditionNodeId);
    if (!node) return;

    const pos = node.position;

    const ruleIndex = (node.data.meta.conditions || []).findIndex(r => r.id === ruleId);

    const newBranchNode = {
      id: "n-" + nanoid(),
      type: "customPill",
      position: {
        x: pos.x + 300,
        y: pos.y + 150 + (ruleIndex >= 0 ? ruleIndex * 120 : 0),
      },
      data: {
        label: node.data.meta.conditions[ruleIndex]?.label || "Condition Output",
        meta: { conditionRuleId: ruleId },
      },
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: conditionNodeId,
      sourceHandle: `rule-${ruleId}`, // <-- important
      target: newBranchNode.id,
    };

    get().updateCurrentFlowElements([...flow.elements, newBranchNode, newEdge]);
  },

  addFallbackBranch: (conditionNodeId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    const node = flow.elements.find(n => n.id === conditionNodeId);
    if (!node) return;

    const pos = node.position;

    const fallbackNode = {
      id: "n-" + nanoid(),
      type: "customPill",
      position: {
        x: pos.x + 300,
        y: pos.y + 150 + (node.data.meta.conditions?.length || 0) * 120
      },
      data: {
        label: "No Condition Matched",
        meta: { fallback: true }
      }
    };

    const fallbackEdge = {
      id: "e-" + nanoid(),
      source: conditionNodeId,
      target: fallbackNode.id,
    };

    node.data.meta.fallback = true;

    get().updateCurrentFlowElements([...flow.elements, fallbackNode, fallbackEdge]);
  },
  createConditionNodeAfter: (parentId, tool) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find((f) => f.id === currentFlowId);
    if (!flow) return;

    const parent = flow.elements.find((n) => n.id === parentId);
    if (!parent) return;

    const p = parent.position;

    const newNode = {
      id: "n-" + nanoid(),
      type: "tool_condition",
      position: { x: p.x + 260, y: p.y },
      data: {
        label: "Conditions",
        meta: {
          type: "tool_condition",
          tool: tool.id,
          conditions: [],       // rules empty initially
          fallback: false
        }
      }
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: parentId,
      target: newNode.id
    };

    const cleaned = flow.elements.filter(el => el.source !== parentId);

    get().updateCurrentFlowElements([...cleaned, newNode, newEdge]);
  },
  convertNodeToRouter: (nodeId, tool) => {
    get().updateNodeById(nodeId, {
      data: {
        label: "Router",
        meta: {
          router: true,
          branches: []
        }
      },
      type: "tool_router"
    });
  },
  convertNodeToCondition: (nodeId, tool) => {
    get().updateNodeById(nodeId, {
      data: {
        label: "Conditions",
        meta: {
          conditions: [],
          fallback: false
        }
      },
      type: "tool_condition"
    });
  },

  convertNodeToTool: (nodeId, tool) => {
    get().updateNodeById(nodeId, {
      data: {
        label: tool.name,
        meta: { tool: tool.id }
      },
      type: "customPill"
    });
  },
  addConditionFallback: (nodeId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    const node = flow.elements.find(n => n.id === nodeId);
    if (!node) return;

    node.data.meta.fallback = true;

    const count = node.data.meta.conditions?.length || 0;

    const newFallbackNode = {
      id: "n-" + nanoid(),
      type: "customPill",
      position: {
        x: node.position.x + 300,
        y: node.position.y + 100 + count * 100
      },
      data: { label: "No Condition Matched", meta: { fallback: true } }
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: nodeId,
      target: newFallbackNode.id
    };

    get().updateCurrentFlowElements([...flow.elements, newFallbackNode, newEdge]);
  },
  // in useFlowsStore.js — replace addNodeUnderConditionRule
  // addNodeUnderConditionRule: (conditionNodeId, ruleId) => {
  //   const { flows, currentFlowId } = get();
  //   const flow = flows.find(f => f.id === currentFlowId);
  //   if (!flow) return;

  //   // find existing branch node that was created for this rule
  //   let branchNode = flow.elements.find(n => n.data?.meta?.conditionRuleId === ruleId);

  //   // if not present, create it (auto-create on first "+")
  //   if (!branchNode) {
  //     const condNode = flow.elements.find(n => n.id === conditionNodeId);
  //     if (!condNode) return;

  //     // compute the rule index (if possible) for vertical placement
  //     const ruleIndex = (condNode.data.meta.conditions || []).findIndex(r => r.id === ruleId);
  //     const yOffset = ruleIndex >= 0 ? 120 + ruleIndex * 120 : 120;

  //     branchNode = {
  //       id: "n-" + nanoid(),
  //       type: "customPill",
  //       position: {
  //         x: condNode.position.x + 300,
  //         y: condNode.position.y + yOffset,
  //       },
  //       data: {
  //         label: "Condition Output",
  //         meta: { conditionRuleId: ruleId },
  //       },
  //     };

  //     const newEdge = {
  //       id: "e-" + nanoid(),
  //       source: conditionNodeId,
  //       sourceHandle: `rule-${ruleId}`, // <-- attach to correct handle
  //       target: branchNode.id,
  //     };

  //     get().updateCurrentFlowElements([...flow.elements, branchNode, newEdge]);

  //     // refresh local reference after persist (not strictly necessary here, but safe)
  //     const updatedFlow = get().getCurrentFlow();
  //     branchNode = updatedFlow.elements.find(n => n.id === branchNode.id);
  //   }

  //   // now open the action picker to add node AFTER the branch node
  //   window.dispatchEvent(
  //     new CustomEvent("wpaf:add-node-after", {
  //       detail: { parentId: branchNode.id },
  //     })
  //   );
  // },
  addNodeUnderConditionRule: (conditionNodeId, ruleId) => {
    // just open the picker for this condition rule
    window._addingConditionRule = { conditionNodeId, ruleId };

    window.dispatchEvent(
      new CustomEvent("wpaf:open-action-picker", {
        detail: { nodeId: conditionNodeId }
      })
    );
  },

  deleteConditionRule: (nodeId, ruleId) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    // find the condition node
    const condNode = flow.elements.find(n => n.id === nodeId);
    if (!condNode) return;

    // Remove rule from the meta
    condNode.data.meta.conditions = (condNode.data.meta.conditions || []).filter(r => r.id !== ruleId);

    // find the branch node that was created for this rule (if any)
    const branchNode = flow.elements.find(n => n.data?.meta?.conditionRuleId === ruleId);

    // Build new elements filtering out branch node and any edges to/from it
    const filtered = flow.elements.filter(el => {
      // remove the branch node itself
      if (branchNode && el.id === branchNode.id) return false;

      // remove edges that reference the branch node (either as source or target)
      if (branchNode && (el.source === branchNode.id || el.target === branchNode.id)) return false;

      return true;
    });

    // Update the flow with modified condition node and without branch node/edges
    // Ensure we replace the condition node instance inside filtered array
    const final = filtered.map(el => (el.id === condNode.id ? condNode : el));

    get().updateCurrentFlowElements(final);
  },

  saveNodeData: (nodeId, data) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find(f => f.id === currentFlowId);
    if (!flow) return;

    // find the node
    const node = flow.elements.find(n => n.id === nodeId);
    if (!node) return;

    // Update the node with the new data
    node.data.meta = { ...node.data.meta, ...data };

    // Update the flow with modified node
    const final = flow.elements.map(el => (el.id === node.id ? node : el));
    get().updateCurrentFlowElements(final);
  },




}));

export default useFlowsStore;
