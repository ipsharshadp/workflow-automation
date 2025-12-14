import React, { useState, useEffect } from "react";
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
    const [listening, setListening] = useState(false);
    const [capturedPayload, setCapturedPayload] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [webhookList, setWebhookList] = useState([]);
    const store = useFlowsStore.getState();
    const currentFlow = store.getCurrentFlow();

    useEffect(() => {
        initWebhookList();
    }, []);
    const initWebhookList = async () => {
        const response = await apiService.webhookList();
        console.log(response.data);
        if (response.success) {
            setWebhookList(response.data);
        }
    }
    const generateWebhookUrl = async () => {
        console.log("currentFlow", currentFlow);
        const response = await apiService.generateWebhookUrl({
            flow_id: currentFlow.id,
            node_id: nodeId
        })
        if (response.success) {
            if (response.webhook_url) {
                setRequestUrl(response.webhook_url);
            }
            setResponseBody(response);
            if (response.uuid) {
                setUuid(response.uuid);
            }
        }

        console.log(response);
    }

    const handleCopy = () => {
        if (requestUrl) {
            navigator.clipboard.writeText(requestUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    const startListening = () => {
        setListening(true);
        setCapturedPayload(null);

        const interval = setInterval(async () => {
            const res = await apiService.listenWebhook(uuid);  // uuid returned from create API

            if (res?.payload) {
                setCapturedPayload(res.payload);
                clearInterval(interval);
                setListening(false);
            }
        }, 1500);

        // Stop polling when modal closes
        return () => clearInterval(interval);
    };
    const onChangeWebhook = (e) => {
        setUuid(e.target.value);
        setRequestUrl(`http://wordpress-demo.test/wp-json/cf7sa/v1/webhooks/callback/${e.target.value}`);
    }
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
                        <Form.Select disabled={webhookList && webhookList.length < 0} onChange={onChangeWebhook}>
                            {webhookList && webhookList.length < 0 && <option>Choose a connection</option>}
                            {webhookList && webhookList.map((webhook) => (
                                <option key={webhook.uuid} value={webhook.uuid}>
                                    {webhook.uuid}
                                </option>
                            ))}
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

                {/* Captured Payload */}
                <Form.Group className="mb-3">
                    <Form.Label>Captured Payload</Form.Label>
                    <div className="code-box">
                        {capturedPayload
                            ? <JsonView src={capturedPayload} />
                            : "No payload captured yet"}
                    </div>
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
                <Button variant="dark" onClick={startListening} disabled={listening}>
                    {listening ? "Listening..." : "Listen"}
                </Button>
                <Button variant="dark">Test Run</Button>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>

        </Modal>
    );
}
