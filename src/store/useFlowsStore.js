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

const sortNodes = (nodes) =>
  nodes.slice().sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0));

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
    console.log("currentFlowId================", currentFlowId);
    // Split
    let { nodes, edges } = separate(elements);
    console.log("nodes================", nodes);

    // Sort nodes for deterministic ordering
    nodes = sortNodes(nodes);

    const newElements = [...nodes, ...edges];

    const updatedFlows = flows.map((f) => {
      console.log("f.id================", f.id);
      console.log("currentFlowId================", currentFlowId);
      console.log("before given new elements", newElements);
      console.log("before given flow", f.elements);
      const updatedFlow = f.id === currentFlowId ? { ...f, elements: newElements } : f
      console.log("updatedFlow================", updatedFlow);
      return updatedFlow
    });
    console.log("final updatedFlows================", updatedFlows);

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
        meta: { tool: tool.id },
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
    console.log("deleteNodeById", nodeId);
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
  }
}));

export default useFlowsStore;
