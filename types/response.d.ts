/* Context Types */
export type ProductType = {
    title: string;
    anime: string,
    img: string,
    price: number,
    stock: boolean,
    idItem: string,
    tallas: Array,
    tipo: string,
};

export type selectionType = {
    name: string,
    code: string
}

/* Context Types */
export type ProductSchemaType = {
    title: string;
    anime: string,
    img: string,
    price: number,
    stock: boolean,
    tallaChica: number,
    tallaMediana: number,
    tallaGrande: number,
    tipo: selectionType
};
