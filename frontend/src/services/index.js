import api from "./api";
const apiData = {
    generateWebhookUrl(data) {
        return api.post("webhooks/create", data);
    },
}

export default apiData;