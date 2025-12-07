
import axios from 'axios'
const BASE = (import.meta.env.VITE_API_BASE || '') + '/wp-json/wpaf/v1'

export const saveFlow = (flow) => axios.post(BASE + '/flows', { flow })
export const listFlows = () => axios.get(BASE + '/flows')
export const getFlow = (id) => axios.get(BASE + '/flows/' + id)
export const runFlow = (id, payload) => axios.post(BASE + '/flows/' + id + '/run', { payload })
