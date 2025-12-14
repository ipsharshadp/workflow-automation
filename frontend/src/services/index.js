import api from "./api";
const apiData = {
    generateWebhookUrl(data) {
        return api.post("webhooks/create", data);
    },
    listenWebhook: async (uuid) => {
        return await api.get(`webhooks/listen/${uuid}`);
    },
    webhookList: async () => {
        return await api.get("webhooks/list");
    },
    getContactFormList: async () => {
        return await api.get("contact-form-7");
    },
}

export default apiData;