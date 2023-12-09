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

export const putProducto = async (token: string, data: ReqPostProducto, id: string) => {
    return await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/producto/${id}`, data, {
        headers: {
            "x-access-token": token
        }
    })
}

export const deleteProductos = async (token: string, productos: any) => {
    return await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/eliminar/productos`, productos, {
        headers: {
            "x-access-token": token
        }
    })
}



