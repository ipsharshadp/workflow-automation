// import React, { useState } from "react";
// import { Handle, Position } from "reactflow";
// import { FiSettings, FiPlus } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";

// export default function PillNode({ id, data }) {
//     const [hover, setHover] = useState(false);
//     const label = data?.label || "Select an app";
//     const meta = data?.meta || {};
//     const isTrigger = meta.type === "trigger";
//     const isAction = meta.type === "action";
//     const isTool = meta.type === "tool";

//     const openSettings = () => {
//         if (window.__WPAF_SELECT_NODE__) window.__WPAF_SELECT_NODE__(id);
//     };

//     const openAddNext = () => {
//         console.log("click open app openAddNext")
//         window.dispatchEvent(
//             new CustomEvent("wpaf:open-app-picker", {
//                 detail: { action: "open-app-picker", nodeId: id },
//             })
//         );
//     };

//     const deleteNode = () => {
//         window.dispatchEvent(
//             new CustomEvent("wpaf:delete-node", { detail: { id } })
//         );
//     };

//     const badgeText = isTrigger ? "Trigger" : isAction ? "Action" : "Tool";

//     return (
//         <div
//             className="pill-node"
//             onMouseEnter={() => setHover(true)}
//             onMouseLeave={() => setHover(false)}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 if (!meta.app) openAddNext();
//             }}
//         >
//             {/* Badge */}
//             {badgeText && <div className="pill-badge">{badgeText}</div>}

//             {/* Node Main */}
//             <div className="pill-container">
//                 {/* Left Icon Box */}
//                 <div className="pill-left">
//                     <div className="pill-icon">+</div>
//                 </div>

//                 {/* Text */}
//                 <div className="pill-text">{label}</div>

//                 {/* Right Connector Dot */}
//                 <div className="pill-connector"></div>

//                 {/* ReactFlow Handles */}
//                 <Handle type="target" position={Position.Left} className="pill-handle-left" />
//                 <Handle type="source" position={Position.Right} className="pill-handle-right" />
//             </div>

//             {/* Hover Toolbar */}
//             {hover && (
//                 <div className="pill-toolbar">
//                     <button className="pill-btn" title="Edit" onClick={openSettings}>
//                         <FiSettings size={16} />
//                     </button>

//                     <button className="pill-btn" title="Add Next Step" onClick={openAddNext}>
//                         <FiPlus size={16} />
//                     </button>

//                     <button className="pill-btn delete" onClick={deleteNode}>
//                         <MdDelete size={16} />
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }
