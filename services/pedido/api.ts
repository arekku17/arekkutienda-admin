import axios from "axios"

export const entregarPedido = async (token: string, id: string, estado: string) => {
    return await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pedido/estado/entregado/${id}`, {estado: estado}, {
        headers: {
            "x-access-token": token
        }
    })
}