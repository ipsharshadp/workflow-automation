// src/data/tools.js
import { FaProjectDiagram, FaClock, FaCode, FaRedo } from 'react-icons/fa'
import { MdLoop } from 'react-icons/md';
import { AiOutlineFile } from 'react-icons/ai'

const tools = [
    { id: 'condition', name: 'Condition', icon: FaProjectDiagram, desc: 'Conditional Logic', type: 'condition', pro: false },
    { id: 'router', name: 'Router', icon: FaRedo, desc: 'Branch by rules', type: 'router', pro: false },
    { id: 'delay', name: 'Delay', icon: FaClock, desc: 'Delay / Wait', type: 'delay', pro: true },
    { id: 'json', name: 'JSON Parser', icon: FaCode, desc: 'Parse JSON', type: 'json', pro: false },
    { id: 'iterator', name: 'Iterator', icon: MdLoop, desc: 'Iterate array', type: 'iterator', pro: true },
    { id: 'csv', name: 'CSV', icon: AiOutlineFile, desc: 'CSV helpers', type: 'csv', pro: true },
    { id: 'router2', name: 'Repeater / Loop', icon: FaRedo, desc: 'Loop / Repeater', type: 'loop', pro: true }
]

export default tools
