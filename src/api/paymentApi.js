import api from "./axios";

export const paymentApi = {
    //
    confirm(data){
        return api.post(
            "/api/confirm",
            {
                paymentKey: data.paymentKey,
                orderId: data.orderId,
                amount: data.amount,
                method: data.method,
                deliveryAddress: data.deliveryAddress,
                approvedAt: data.approvedAt
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
    },

}