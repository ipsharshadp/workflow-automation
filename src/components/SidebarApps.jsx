import React from 'react';
import { Container, Row, Col, ListGroup, Nav, Button } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className='p-3'>
      <h5 className="text-primary">Actions</h5>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Email</Button>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="link" className="text-dark">SMS</Button>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Update Profile Property</Button>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Notification</Button>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Webhook</Button>
        </ListGroup.Item>
      </ListGroup>

      <h5 className="text-primary mt-4">Timing</h5>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Time Delay</Button>
        </ListGroup.Item>
      </ListGroup>

      <h5 className="text-primary mt-4">Logic</h5>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Button variant="link" className="text-dark">Conditional Split</Button>
        </ListGroup.Item>
      </ListGroup>
    </div>

  );
};

export default Sidebar;


// import React from 'react'
// import useFlowsStore from '../store/useFlowsStore'
// import { FaWpforms, FaMailchimp, FaClipboardList } from 'react-icons/fa'

// const apps = [
//   { id: 'cf7', name: 'Contact Form 7', icon: <FaWpforms /> },
//   { id: 'mailchimp', name: 'Mailchimp', icon: <FaMailchimp /> },
//   { id: 'mailchimpForms', name: 'Mailchimp Forms', icon: <FaClipboardList /> }
// ]

// export default function SidebarApps() {
//   const openPicker = (nodeId) => useFlowsStore.getState().openPickerForNode?.(nodeId) // not used, but kept
//   const onDragStart = (e, app) => {
//     e.dataTransfer.setData('application/json', JSON.stringify(app))
//     e.dataTransfer.effectAllowed = 'copy'
//   }

//   return (
//     <div className="apps-panel">
//       <h4>Apps</h4>
//       {apps.map(a => (
//         <div key={a.id} className="app-card" draggable onDragStart={(e) => onDragStart(e, a)}>
//           <div className="app-icon">{a.icon}</div>
//           <div className="app-name">{a.name}</div>
//         </div>
//       ))}
//       <button
//         className="open-tools"
//         onClick={() =>
//           window.dispatchEvent(new CustomEvent("wpaf:open-tools", {
//             detail: { type: "open-tools" }
//           }))
//         }
//       >
//         Tools
//       </button>
//     </div>
//   )
// }
