import axios, { AxiosResponse } from 'axios';

export type ReqPostProducto = {
    title: string;
    anime: string,
    img: string,
    price: number,
    stock: boolean,
    tallas: Array<number>,
    tipo: string,
}

export const postProductos = async (token: string, data: ReqPostProducto) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/producto`, data, {
        headers: {
            "x-access-token": token
        }
    })
}
