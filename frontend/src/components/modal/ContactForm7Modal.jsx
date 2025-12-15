import React, { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    InputGroup,
} from "react-bootstrap";
import apiService from "../../services";
import showToast from "../../utils/toastUtil";
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { MdSync } from 'react-icons/md'
import useFlowsStore from "../../store/useFlowsStore";


export default function ContactForm7Modal({ show, onClose, nodeId, nodeData }) {

    const [listening, setListening] = useState(false);
    const [capturedPayload, setCapturedPayload] = useState(null);
    const [formId, setFormId] = useState(nodeData?.meta?.formId);
    const [contactFormList, setContactFormList] = useState([]);

    useEffect(() => {
        if (show) {
            initContactFormList();
        }
    }, [show]);
    const initContactFormList = async () => {
        const response = await apiService.getContactFormList();

        if (response.success) {
            setContactFormList(response.data);
        }
    }


    const startListening = () => {
        setListening(true);
        setCapturedPayload(null);

        const interval = setInterval(async () => {
            const res = await apiService.listenContactForm(formId);
            if (res?.payload) {
                setCapturedPayload(res.payload);
                clearInterval(interval);
                setListening(false);
            }
        }, 1500);

        // Stop polling when modal closes
        return () => clearInterval(interval);
    };

    const resync = () => {
        initContactFormList();
    }

    const saveNodeData = () => {
        const data = {
            formId: formId
        }
        const store = useFlowsStore.getState();
        store.saveNodeData(nodeId, data);
        onClose(data);
    }
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <div>
                    <h5 className="m-0">On Form Submit</h5>
                    <small>Contact Form 7</small>
                </div>
            </Modal.Header>

            <Modal.Body>

                <Form.Group className="mb-3">
                    <Form.Label>Forms</Form.Label>
                    <InputGroup>
                        <Form.Select onChange={(e) => setFormId(e.target.value)} value={formId}>
                            <option>Choose a form</option>
                            {contactFormList && contactFormList.map((contactForm) => (
                                <option key={contactForm.id} value={contactForm.id}>
                                    {contactForm.title}
                                </option>
                            ))}
                        </Form.Select>
                        <Button variant="outline-primary" onClick={resync}><MdSync /></Button>
                    </InputGroup>
                </Form.Group>


                <Form.Group className="mb-3">
                    {capturedPayload && (
                        <>
                            <Form.Label>Captured Payload</Form.Label>
                            <div className="code-box">
                                {capturedPayload
                                    ? <JsonView src={capturedPayload} />
                                    : "No payload captured yet"}
                            </div>
                        </>
                    )}
                </Form.Group>


            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={startListening} disabled={listening}>
                    {listening ? "Listening..." : "Listen"}
                </Button>
                <Button disabled={!formId} variant="success" onClick={saveNodeData}>
                    Save
                </Button>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>

        </Modal>
    );
}
