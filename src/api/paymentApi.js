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
    // 7만원 결제 승인 요청
    basicFee(data){
        return api.post(
            "/api/basicFee",
            {
                orderId: data.orderId,
                orderName: data.orderName,
                amount: data.amount,
                paymentKey: data.paymentKey
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
    },


    //프로젝트 등록
    //FormData 사용하기
    projectRegist(data){
        const formData = new FormData();
        // 일반 데이터 추가
        formData.append('orderId', data.orderId);
        formData.append('orderName', data.orderName);
        formData.append('selectedPlan', data.selectedPlan);
        formData.append('amount', data.amount);
        formData.append('category', data.category);
        formData.append('makerId', data.makerId);
        formData.append('summary', data.summary);
        formData.append('discount', data.discount);
        formData.append('targetAmount', data.targetAmount);

        // 이미지 배열 처리
        data.contentImage.forEach((image, index) => {
            formData.append(`contentImage[${index}]`, image);
        });

        return api.post("/api/projectRegist", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

    },
}