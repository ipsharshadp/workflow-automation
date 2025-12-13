import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function MakeRequestModal({ show, onClose, nodeId, nodeData }) {
    const [method, setMethod] = useState("GET");
    const [requestUrl, setRequestUrl] = useState("");
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);
    const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);

    // Add new row
    const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
    const addQueryParam = () => setQueryParams([...queryParams, { key: "", value: "" }]);

    // Remove row
    const removeHeader = (index) =>
        setHeaders(headers.filter((_, i) => i !== index));

    const removeQueryParam = (index) =>
        setQueryParams(queryParams.filter((_, i) => i !== index));

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <div>
                    <small className="text-primary fw-bold">Action</small>
                    <h5 className="m-0">Make A Request</h5>
                    <small className="text-secondary">HTTP</small>
                </div>
            </Modal.Header>

            <Modal.Body>
                {/* Connection section */}
                <Form.Group className="mb-3">
                    <Form.Label>Connection (optional)</Form.Label>
                    <InputGroup>
                        <Form.Select disabled>
                            <option>Choose a connection</option>
                        </Form.Select>
                        <Button variant="outline-primary">Add Connection</Button>
                    </InputGroup>
                </Form.Group>

                {/* Request URL */}
                <Form.Group className="mb-3">
                    <Form.Label>Request URL *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="https://api.example.com"
                        value={requestUrl}
                        onChange={(e) => setRequestUrl(e.target.value)}
                    />
                </Form.Group>

                {/* Method Dropdown */}
                <Form.Group className="mb-4">
                    <Form.Label>Method *</Form.Label>
                    <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
                        {httpMethods.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Headers */}
                <div className="mb-4">
                    <h6 className="fw-bold">Headers</h6>

                    {headers.map((item, index) => (
                        <Row className="mb-2" key={index}>
                            <Col>
                                <Form.Control
                                    placeholder="Key"
                                    value={item.key}
                                    onChange={(e) => {
                                        const updated = [...headers];
                                        updated[index].key = e.target.value;
                                        setHeaders(updated);
                                    }}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) => {
                                        const updated = [...headers];
                                        updated[index].value = e.target.value;
                                        setHeaders(updated);
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
                                {index > 0 && (
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => removeHeader(index)}
                                    >
                                        🗑
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}

                    <Button variant="outline-secondary" size="sm" onClick={addHeader}>
                        + Add
                    </Button>
                </div>

                {/* Query Params */}
                <div>
                    <h6 className="fw-bold">Query Params</h6>

                    {queryParams.map((item, index) => (
                        <Row className="mb-2" key={index}>
                            <Col>
                                <Form.Control
                                    placeholder="Key"
                                    value={item.key}
                                    onChange={(e) => {
                                        const updated = [...queryParams];
                                        updated[index].key = e.target.value;
                                        setQueryParams(updated);
                                    }}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) => {
                                        const updated = [...queryParams];
                                        updated[index].value = e.target.value;
                                        setQueryParams(updated);
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
                                {index > 0 && (
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => removeQueryParam(index)}
                                    >
                                        🗑
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}

                    <Button variant="outline-secondary" size="sm" onClick={addQueryParam}>
                        + Add
                    </Button>
                </div>
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
