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
import { MdRefresh, MdSync, MdSyncAlt } from 'react-icons/md'

export default function ContactForm7Modal({ show, onClose, nodeId, nodeData }) {

    const [listening, setListening] = useState(false);
    const [capturedPayload, setCapturedPayload] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [contactFormList, setContactFormList] = useState([]);
    const store = useFlowsStore.getState();
    const currentFlow = store.getCurrentFlow();

    useEffect(() => {
        initContactFormList();
    }, []);
    const initContactFormList = async () => {
        const response = await apiService.getContactFormList();
        console.log(response.data);
        if (response.success) {
            setContactFormList(response.data);
        }
    }


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
    const resync = () => {
        initContactFormList();
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
                {/* Connection section */}
                <Form.Group className="mb-3">
                    <Form.Label>Forms</Form.Label>
                    <InputGroup>
                        <Form.Select>
                            {contactFormList && contactFormList.length < 0 && <option>Choose a connection</option>}
                            {contactFormList && contactFormList.map((contactForm) => (
                                <option key={contactForm.id} value={contactForm.id}>
                                    {contactForm.title}
                                </option>
                            ))}
                        </Form.Select>
                        <Button variant="outline-primary" onClick={resync}><MdSync /></Button>
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


            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={startListening} disabled={listening}>
                    {listening ? "Listening..." : "Listen"}
                </Button>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>

        </Modal>
    );
}
