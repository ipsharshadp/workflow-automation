import React, { useState } from "react";
import {
    Modal,
    Button,
    Form,
    InputGroup,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import apiService from "../../services";
import showToast from "../../utils/toastUtil";
import useFlowsStore from "../../store/useFlowsStore";
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { MdContentCopy } from 'react-icons/md';

export default function WebhookModal({ show, onClose, nodeId, nodeData }) {
    const [requestUrl, setRequestUrl] = useState("");
    const [responseBody, setResponseBody] = useState(null);
    const [copied, setCopied] = useState(false);
    const store = useFlowsStore.getState();
    const currentFlow = store.getCurrentFlow();

    const generateWebhookUrl = async () => {
        console.log("currentFlow", currentFlow);
        const response = await apiService.generateWebhookUrl({
            flow_id: currentFlow.id,
            node_id: nodeId
        })
        if (response.success) {
            setRequestUrl(response.webhook_url);
            setResponseBody(response);
        }
        c
        onsole.log(response);
    }

    const handleCopy = () => {
        if (requestUrl) {
            navigator.clipboard.writeText(requestUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <div>
                    <h5 className="m-0">Webhook</h5>
                </div>
            </Modal.Header>

            <Modal.Body>
                {/* Connection section */}
                <Form.Group className="mb-3">
                    <Form.Label>Connection</Form.Label>
                    <InputGroup>
                        <Form.Select disabled>
                            <option>Choose a connection</option>
                        </Form.Select>
                        <Button variant="outline-primary" onClick={generateWebhookUrl}>Add Webhook</Button>
                    </InputGroup>
                </Form.Group>

                {/* Request URL */}
                <Form.Group className="mb-3">
                    <Form.Label>Callback URL</Form.Label>
                    {/* <Form.Control
                        type="text"
                        placeholder="https://api.example.com"
                        value={requestUrl}
                        onChange={(e) => setRequestUrl(e.target.value)}
                    /> */}

                    <InputGroup>
                        <Form.Control value={requestUrl} readOnly />

                        <OverlayTrigger
                            placement="top"
                            show={copied}
                            overlay={<Tooltip id="copy-tooltip">Copied!</Tooltip>}
                        >
                            <Button variant="outline-secondary" onClick={handleCopy}>
                                <MdContentCopy />
                            </Button>
                        </OverlayTrigger>
                    </InputGroup>
                </Form.Group>
                {/* Response Body */}
                <Form.Group className="mb-3">
                    <Form.Label>Response Body</Form.Label>
                    <div className="code-box">
                        {responseBody
                            ? <JsonView src={responseBody} />
                            : ""}

                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark">Test Run</Button>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>

        </Modal>
    );
}
