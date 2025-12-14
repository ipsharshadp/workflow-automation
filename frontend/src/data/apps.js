// src/data/apps.js
import { FaWpforms } from "react-icons/fa";
import { SiMailchimp } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { FaGlobe } from 'react-icons/fa';
import {
    MdEmail,
    MdSms,
    MdPerson,
    MdNotificationsNone,
    MdAccessTime,
    MdCallSplit
} from "react-icons/md";
import { TbWebhook } from "react-icons/tb";

const apps = [
    {
        id: "email",
        name: "Email",
        icon: MdEmail,
        type: "app  "
    },
    {
        id: "notification",
        name: "Notification",
        icon: MdNotificationsNone,
        type: "app"
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        icon: MdOutlineMail,
        type: "app"
    },
    {
        id: "webhook",
        name: "Webhook",
        icon: TbWebhook,
        type: "app"
    },
    {
        id: "http_request",
        name: "Make A Request",
        icon: FaGlobe,
        type: "app  "
    },
    {
        id: "contact_form_7",
        name: "Contact Form 7",
        icon: FaWpforms,
        type: "app"
    }

];

export default apps;
