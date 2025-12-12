import useFlowsStore from "../store/useFlowsStore";
import { nanoid } from "nanoid";

export const onSelectAction = (action, nodeId) => {
    const store = useFlowsStore.getState();
    console.log("window._addingNewNode", window._addingNewNode);

    const isApp = action.category === "app" || action.type === "app";
    const isTool = action.category === "tool" || action.type === "router" || action.type === "condition";
    console.log("action", action);
    console.log("isApp", isApp);
    console.log("isTool", isTool);
    if (window._addingConditionRule) {
        const { conditionNodeId, ruleId } = window._addingConditionRule;
        window._addingConditionRule = null;

        const store = useFlowsStore.getState();
        const flow = store.getCurrentFlow();
        const condNode = flow.elements.find(n => n.id === conditionNodeId);

        if (!condNode) return;

        // create final node positioned correctly
        const newNodeId = "n-" + nanoid();
        const newNode = {
            id: newNodeId,
            type: "customPill",
            position: {
                x: condNode.position.x + 300,
                y: condNode.position.y + 150
            },
            data: {
                label: action.name,
                meta: { tool: action.id }
            }
        };

        const newEdge = {
            id: "e-" + nanoid(),
            source: conditionNodeId,
            sourceHandle: `rule-${ruleId}`,  // important
            target: newNodeId
        };

        store.updateCurrentFlowElements([
            ...flow.elements,
            newNode,
            newEdge
        ]);

        onHide();
        return;
    }

    // ⭐ CASE 1: User is adding a NEW node after current node
    if (window._addingNewNode) {

        if (action.type === "router") {
            store.createRouterNodeAfter(nodeId, action);
        }

        else if (action.type === "condition") {
            store.createConditionNodeAfter(nodeId, action);
        }

        else {
            // all other tools fall here: delay, webhook, json, api, transform...
            store.createToolNodeAfter(nodeId, action);
        }

        window._addingNewNode = false;
        return;
    }

    // ⭐ CASE 2: User is selecting an APP for an existing node
    if (isApp) {
        store.setNodeAppById(nodeId, action);
        return;
    }

    // ⭐ CASE 3: User is selecting a TOOL for an existing node → update node type
    if (isTool) {
        if (action.type === "router") {
            store.convertNodeToRouter(nodeId, action);
        }

        if (action.type === "condition") {
            store.convertNodeToCondition(nodeId, action);
        }

        // other tools
        if (action.type !== "router" && action.type !== "condition") {
            store.convertNodeToTool(nodeId, action);
        }

        return;
    }
};