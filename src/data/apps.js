// src/data/apps.js
import { FaWpforms } from "react-icons/fa";
import { SiMailchimp } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
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
    },
    {
        id: "notification",
        name: "Notification",
        icon: MdNotificationsNone,
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        icon: MdOutlineMail,
    },
    {
        id: "webhook",
        name: "Webhook",
        icon: TbWebhook,
    },

];

export default apps;
