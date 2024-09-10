import "../styles/paypal.css"
import { AddressFullObject } from '@/lib/location/useLocationForm'
import { PayPalHostedField, PayPalHostedFieldsProvider, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useEffect, useRef, useState } from 'react'
import SubmitPayment from './SubmitPayment';
import { paypalApiRequest } from '@/app/api-request/paypal.api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setNotify } from '@/lib/features/notifySlice';
import { CreatePaypalCheckoutRequest, ordersApiRequest } from '@/app/api-request/orders.api';
import { io, Socket } from "socket.io-client";
import { BACKEND_SERVER_URL } from "@/config";
import { HttpError } from "@/lib/utils/http";

export default function Paypal({ name, phone, address }: { name: string, phone: string, address: AddressFullObject}) {
  const token = useAppSelector(state => state.auth).token
  const user = useAppSelector(state => state.auth).user
  const [socket, setSocket] = useState<Socket>({} as Socket)
  const dispatch = useAppDispatch()
  const [clientToken, setClientToken] = useState(null);
  const [clientId, setClientId] = useState(null)
  const cardHolderName = useRef(null);

  const CUSTOM_FIELD_STYLE = {"border":"1px solid #606060",};
  const INVALID_COLOR = {
	  color: "#dc3545",
  };

  useEffect(() => {
    if(token) {
      (async () => {
        const response = await paypalApiRequest.generateToken(token, dispatch);
        setClientToken(response.payload.clientToken);
        setClientId(response.payload.clientId)
      })();
    }
	}, [token, dispatch]);

  useEffect(() => {
    const socket = io(BACKEND_SERVER_URL ? BACKEND_SERVER_URL : ''); // Replace with your server URL

    socket.on('connect', () => {
      setSocket(socket)
    })

    socket.on('TRANSACTION_SUCCESS', () => {
      dispatch(setNotify({ success: 'Đặt hàng thành công.'}))
      window.location.href = '/cart'
    });

    socket.on('TRANSACTION_FAILED', (message) => {
      console.log(message)
      dispatch(setNotify({ error: 'Đặt hàng thất bại.' }))
    });

    return () => {
      socket.off('connect')
      socket.off('TRANSACTION_SUCCESS')
      socket.off('TRANSACTION_FAILED')
    }
  }, [dispatch]);

  async function createOrderCallback() {
    if(!token || !user || !socket.connected) return ''

    try {
      const body: CreatePaypalCheckoutRequest = { socketId: (socket.id as string), userId: user._id, name, phone, address }
      const response = await ordersApiRequest.createPaypalCheckoutSession(token, dispatch, body)
  
      const orderData = response.payload.jsonResponse
  
      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
  
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      if (error instanceof HttpError) {
        // Handle the specific HttpError
        console.log("Error message:", error.message);
        // Example: show error message to the user
        dispatch(setNotify({ error: 'Thanh toán thất bại' }))
      } else {
        // Handle other types of errors
        console.log("An unexpected error occurred:", error);
        dispatch(setNotify({ error: 'An unexpected error occurred' }))
      }
      // dispatch(setNotify({ error: 'Thanh toán thất bại' }))
      // console.error(error);
      // throw new Error(error);
    }
  }

  return (
		<>
			{clientToken && clientId ? (
        <div>
				<PayPalScriptProvider
					options={{
						clientId,
						components: "buttons,hosted-fields",
						dataClientToken: clientToken,
					}}
				>
					<PayPalHostedFieldsProvider
						styles={{".valid":{"color":"#28a745"},".invalid":{"color":"#dc3545"},"input":{"font-family":"monospace","font-size":"16px"}}}
						createOrder={createOrderCallback}
					>
                        <label htmlFor="card-number">
                            Số thẻ
                            <span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="card-number"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="number"
                            options={{
                                selector: "#card-number",
                                placeholder: "1234 5678 9012 3456",
                            }}
                        />
                        <label title="This represents the full name as shown in the card">
                            Tên trên thẻ
                        <input
                          id="card-holder"
                          ref={cardHolderName}
                          className="card-field"
                          style={{ "border":"1px solid #606060", outline: "none" }}
                          type="text"
                          placeholder="NGUYEN VAN A"
                        />
                        </label>
                        <div className="cvv_expiration-date_section">
                          <div>
                            <label htmlFor="cvv">
                                CVV<span style={INVALID_COLOR}>*</span>
                            </label>
                            <PayPalHostedField
                                id="cvv"
                                className="card-field"
                                style={CUSTOM_FIELD_STYLE}
                                hostedFieldType="cvv"
                                options={{
                                    selector: "#cvv",
                                    placeholder: "123",
                                    maskInput: true,
                                }}
                            />
                          </div>
                          <div>
                            <label htmlFor="expiration-date">
                                Ngày hết hạn
                                <span style={INVALID_COLOR}>*</span>
                            </label>
                            <PayPalHostedField
                                id="expiration-date"
                                className="card-field"
                                style={CUSTOM_FIELD_STYLE}
                                hostedFieldType="expirationDate"
                                options={{
                                    selector: "#expiration-date",
                                    placeholder: "MM/YYYY",
                                }}
                            />
                          </div>
                        </div>
						<SubmitPayment cardHolderName={cardHolderName}/>
					</PayPalHostedFieldsProvider>
				</PayPalScriptProvider>
        </div>
			) : (
        <div className="paypal_loading">
        <svg
          aria-hidden="true"
          role="status"
          className="loader animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      </div>
			)}
		</>
	)
}
