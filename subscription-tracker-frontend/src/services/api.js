import axios from "axios";
const API=axios.create({
    baseURL:  "http://localhost:6382/api",
    
});
// Named helpers that match backend endpoints / payload shapes
export const getAllUsers = () => API.get(`/users`);
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (user) => API.post(`/users`, user);
export const updateUser = (id, user) => API.put(`/users/${id}`, user);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const getAllSubscriptions = () => API.get(`/subscriptions`);
export const getSubscriptionsByUserId = (userId) => API.get(`/subscriptions/user/${userId}`);
export const createSubscription = (subscription) => API.post(`/subscriptions`, subscription);
export const updateSubscription = (id, subscription) => API.put(`/subscriptions/${id}`, subscription);
export const deleteSubscription = (id) => API.delete(`/subscriptions/${id}`);

export const getAllPayments = () => API.get(`/payments`);
export const getPaymentsBySubscriptionId = (subscriptionId) => API.get(`/payments/subscription/${subscriptionId}`);
export const createPayment = (payment) => API.post(`/payments`, payment);
export const updatePayment = (id, payment) => API.put(`/payments/${id}`, payment);
export const deletePayment = (id) => API.delete(`/payments/${id}`);

export default API;