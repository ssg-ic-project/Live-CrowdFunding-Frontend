import api from "./axios";

export const paymentApi = {
    //
    confirm(data){
        return api.post(
            "http://localhost:8080/api/confirm",
            {
                paymentKey: data.paymentKey,
                orderId: data.orderId,
                amount: data.amount
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