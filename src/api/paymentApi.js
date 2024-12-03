// C:\Workspace\crofle_front\src\api\paymentApi.js
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
    projectRegist(data){
        const formData = new FormData();

        // DB 스키마에 맞춰 데이터 추가
        formData.append('makerId', data.makerId);          // bigint
        formData.append('planId', data.selectedPlan);      // bigint - 요금제 ID
        formData.append('categoryId', data.category);      // bigint
        formData.append('productName', data.orderName);    // varchar(20)
        formData.append('summary', data.summary);          // varchar(50)
        formData.append('price', data.amount);            // int
        formData.append('discountPercentage', data.discount); // int
        formData.append('goalAmount', data.targetAmount);    // int
        formData.append('reviewStatus', '검토중');           // enum

        // // 이미지 처리
        // data.contentImage.forEach((image, index) => {
        //     formData.append('contentImage', image);   // varchar(200)
        // });
        if (data.contentImage && Array.isArray(data.contentImage)) {
            data.contentImage.forEach((image) => {
                if (image) {
                    formData.append('contentImage', image);
                }
            });
        } else {
            console.log('이미지 데이터가 없거나 배열이 아닙니다.');
        };


        return api.post("/api/project", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
}