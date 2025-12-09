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

  updateCurrentFlowElements: (elements) => {
    set((state) => {
      const flows = state.flows.map((f) => {
        if (f.id !== state.currentFlowId) return f;
        return { ...f, elements };
      });
      saveAll(flows);
      return { flows };
    });
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

  setNodes: (incoming) => {
    const { currentFlowId, flows } = get();

    const updatedFlows = flows.map((f) => {
      if (f.id !== currentFlowId) return f;

      const prevNodes = f.elements.filter((e) => e.data); // existing nodes
      const edges = f.elements.filter((e) => e.source && e.target);

      // Incoming can be array OR function
      const nextNodes =
        typeof incoming === "function"
          ? incoming(prevNodes)
          : incoming;

      return { ...f, elements: [...nextNodes, ...edges] };
    });

    saveAll(updatedFlows);
    set({ flows: updatedFlows });
  },

  /* -------------------- SET EDGES (Used by ReactFlow) -------------------- */

  setEdges: (incoming) => {
    const { currentFlowId, flows } = get();

    const updatedFlows = flows.map((f) => {
      if (f.id !== currentFlowId) return f;

      const prevEdges = f.elements.filter((e) => e.source && e.target);
      const nodes = f.elements.filter((e) => e.data);

      const nextEdges =
        typeof incoming === "function"
          ? incoming(prevEdges)
          : incoming;

      return { ...f, elements: [...nodes, ...nextEdges] };
    });

    saveAll(updatedFlows);
    set({ flows: updatedFlows });
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

  createToolNodeAfter: (nodeId, tool) => {
    const { flows, currentFlowId } = get();
    const flow = flows.find((f) => f.id === currentFlowId);
    if (!flow) return;

    const parent = flow.elements.find((n) => n.id === nodeId);
    if (!parent) return;

    // If parent has no position, set default x/y
    const parentPos = parent.position || { x: 0, y: 0 };

    const newNode = {
      id: "n-" + nanoid(),
      type: `tool_${tool.type}`,
      position: { x: parentPos.x + 240, y: parentPos.y },
      data: { label: tool.name, meta: { tool: tool.id } },
    };

    const newEdge = {
      id: "e-" + nanoid(),
      source: nodeId,
      target: newNode.id,
    };

    const updated = [...flow.elements, newNode, newEdge];

    get().updateCurrentFlowElements(updated);
  },
}));

export default useFlowsStore;
