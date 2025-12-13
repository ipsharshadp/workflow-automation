import React from 'react';
import { Container, Row, Col, ListGroup, Nav, Button } from 'react-bootstrap';
import apps from "../data/apps";
import tools from "../data/tools";


const Sidebar = () => {
  const onDragStartApp = (e, app) => {
    // ensure both a custom mime-type and fallback text are set
    e.dataTransfer.setData('application/x-app', JSON.stringify(app));
    e.dataTransfer.setData('text/plain', app.id || app.name || 'app');
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDragStartTool = (e, tool) => {
    e.dataTransfer.setData('application/x-tool', JSON.stringify(tool));
    e.dataTransfer.setData('text/plain', tool.id || tool.name || 'tool');
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className='p-3'>
      <h5 className="text-primary">Actions</h5>
      <ListGroup >
        {apps.map(app => (
          <ListGroup.Item key={app.id} className="d-flex align-items-center justify-content-between">

            {/* FULL ROW DRAGGABLE */}
            <div
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("application/x-app", JSON.stringify(app));
                e.dataTransfer.effectAllowed = "copy";
              }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", cursor: "grab" }}
            >
              {app.icon ? <app.icon size={20} /> : null}
              <span>{app.name}</span>
            </div>

            {/* DRAG HANDLE UI (just visual, optional) */}
            <div
              className='drag-handle'
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("application/x-app", JSON.stringify(app));
                e.dataTransfer.effectAllowed = "copy";
              }}
              style={{
                width: 30,
                height: 30,
                border: "1px dashed #999",
                borderRadius: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "grab",
              }}
            >
              ⋮⋮
            </div>

          </ListGroup.Item>


        ))}
      </ListGroup>

      <h5 className="text-primary mt-4">Tool</h5>
      <ListGroup>
        {tools.map(tool => (
          <ListGroup.Item key={tool.id}>
            <div
              draggable={true}
              onDragStart={(e) => onDragStartTool(e, tool)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'grab' }}
            >
              {tool.icon ? <tool.icon size={18} /> : null}
              <span>{tool.name}</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* <ListGroup>
        <ListGroup.Item>
          Time Delay
        </ListGroup.Item>
      </ListGroup> */}

      {/* <h5 className="text-primary mt-4">Logic</h5>
      <ListGroup>
        <ListGroup.Item>
          Conditional Split
        </ListGroup.Item>
      </ListGroup> */}
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
