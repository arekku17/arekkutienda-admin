/* Context Types */
export type ProductType = {
    title: string;
    anime: string,
    img: string,
    price: number,
    stock: boolean,
    idItem: string,
    tallas: Array<tallasType>,
    tipo: string,
};

export type selectionType = {
    name: string,
    code: string
}

export type tallasType = {
    _id: string,
    name: string,
    count: number
}

/* Context Types */
export type ProductSchemaType = {
    title: string;
    anime: string,
    img: string,
    price: number,
    stock: boolean,
    tallas: Array<tallasType>,
    tipo: selectionType
};
