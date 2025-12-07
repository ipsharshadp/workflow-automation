// src/data/apps.js
import { FaWpforms } from "react-icons/fa";
import { SiMailchimp } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";

const apps = [
    {
        id: "cf7",
        name: "Contact Form 7",
        icon: FaWpforms,
        desc: "Trigger when form is submitted",
        type: "trigger",
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        icon: SiMailchimp,
        desc: "Add subscriber",
        type: "action",
    },
    {
        id: "mailchimpForms",
        name: "Mailchimp Forms",
        icon: MdOutlineMail,
        desc: "Form-based signup",
        type: "action",
    },
    {
        id: "webhook",
        name: "Webhook",
        icon: AiOutlineLink,
        desc: "Incoming webhook trigger",
        type: "trigger"
    }

];

export default apps;
