import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import apps from "../../data/apps";
import tools from "../../data/tools";
import ListGroup from 'react-bootstrap/ListGroup';
import useFlowsStore from "../../store/useFlowsStore";

export default function ActionPickerModal({ show, onHide, nodeId }) {
    console.log("ActionPickerModal", show, onHide, nodeId);
    const onSelectAction = (action) => {
        console.log("Selected action:", action);
        useFlowsStore.getState().setNodeAppById(nodeId, action);
        onHide();
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
