import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import apps from "../../data/apps";
import tools from "../../data/tools";
import ListGroup from 'react-bootstrap/ListGroup';
import useFlowsStore from "../../store/useFlowsStore";
import { nanoid } from "nanoid";

export default function ActionPickerModal({ show, onHide, nodeId }) {
    console.log("ActionPickerModal", show, onHide, nodeId);
    // const onSelectAction = (action) => {
    //     console.log("Selected action:", action);
    //     const store = useFlowsStore.getState();

    //     // if (window._addingNewNode) {
    //     //     // create NEW node
    //     //     store.createToolNodeAfter(nodeId, action);
    //     //     window._addingNewNode = false;
    //     // } else {
    //     //     // update EXISTING node
    //     //     store.setNodeAppById(nodeId, action);
    //     // }


    //     if (window._addingNewNode) {
    //         if (action.type === "router") {
    //             store.createRouterNodeAfter(nodeId, action);
    //         } else if (action.type === "condition") {
    //             store.createConditionNodeAfter(nodeId, action);
    //         } else {
    //             store.createToolNodeAfter(nodeId, action); // default fallback
    //         }
    //         window._addingNewNode = false;
    //     } else {
    //         store.setNodeAppById(nodeId, action); // Editing existing node
    //     }

    //     onHide();
    // };

    const onSelectAction = (action) => {
        const store = useFlowsStore.getState();

        const isApp = action.category === "app" || action.type === "app";
        const isTool = action.category === "tool" || action.type === "router" || action.type === "condition";
        const type = action.type || action.category || "unknown";
        console.log("window._addingNewNode", window._addingNewNode)
        console.log("type", type)
        console.log("action", action)
        console.log("isApp", isApp)

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
            onHide();
            return;
        }

        // ⭐ CASE 2: User is selecting an APP for an existing node
        if (isApp) {
            store.setNodeAppById(nodeId, action);
            onHide();
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

            onHide();
            return;
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton className="border-0">
            </Modal.Header>
            <Modal.Body className="pb-5">
                {apps && (
                    <div>
                        <h3>Apps</h3>
                        <ListGroup>
                            {apps?.map((app) => (
                                <ListGroup.Item
                                    className="cursor-pointer"
                                    key={app.id}
                                    onClick={() => onSelectAction(app)}
                                >
                                    {app.icon ? <app.icon size={22} /> : null}
                                    {app.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
                {tools && (<div className="mt-3">
                    <h3>Tools</h3>
                    <ListGroup>
                        {tools?.map((tool) => (
                            <ListGroup.Item
                                className="cursor-pointer"
                                key={tool.id}
                                onClick={() => onSelectAction(tool)}
                            >
                                {tool.icon ? <tool.icon size={22} /> : null}
                                {tool.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                )}
            </Modal.Body>
        </Modal>
    );
}
