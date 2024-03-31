'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { ProductSchemaType, ProductType } from '@/types/response';
import ErrorMesage from '@/components/ErrorMesage';
import { Dropdown } from 'primereact/dropdown';
import { postProductos, putProducto } from '@/services/producto/api';

import { redirect } from 'next/navigation';
import { Toast } from 'primereact/toast';
import useSWR from 'swr';

import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`).then(res => res.json())

const ProductoSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Muy breve!')
        .max(70, 'Demasiado extenso!')
        .required('Campo Requerido'),
    anime: Yup.string()
        .required('Campo Requerido'),
    img: Yup.string()
        .required('Campo Requerido'),
    price: Yup.number()
        .required('Campo Requerido')
        .typeError("Debe ser un número"),
    stock: Yup.boolean()
        .required('Campo Requerido'),
    tallaChica: Yup.number()
        .required('Campo Requerido'),
    tallaMediana: Yup.number()
        .required('Campo Requerido'),
    tallaGrande: Yup.number()
        .required('Campo Requerido'),
    tipo: Yup.object()
        .required('Campo Requerido')

});

const EditarProducto = ({ params }: { params: { idItem: string } }) => {


    const { data: product, error, isLoading } = useSWR(`producto/${params.idItem}`, fetcher)

    console.log(product)

    const [imageUploaded, setImageUploaded] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [url, setUrl] = useState("");
    const { data: session, status } = useSession();
    const toast = useRef(null);
    const router = useRouter();

    const tiposProductos = [
        { name: "playera", code: "playera" },
        { name: "llavero", code: "llavero" },
        { name: "sudadera", code: "sudadera" },
        { name: "poster", code: "poster" },
        { name: "boton", code: "boton" }
    ]

    const showSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Agregado exitoso', detail: 'Se editó exitosamente el producto', life: 3000 });
    }

    const showError = () => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al editar el producto', life: 3000 });
    }

    const invoiceUploadHandler = async (event: any, setFieldValue: any) => {
        // convert file to base64 encoded 
        const file = event.files[0];

        let formData = new FormData();
        formData.append('image', file);

        setLoadingUpload(true)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/imagen/upload`, formData, {
            headers: {
                "x-access-token": session?.user.token
            }
        }
        ).then(res => {
            console.log(res.data)
            setUrl(res.data.url)
            setImageUploaded(res.data.url)
            setFieldValue("img", res.data.url)
        });
        setLoadingUpload(false)
    };


    const onSubmit = (values: ProductSchemaType) => {
        putProducto("" + session?.user.token, {
            title: values.title,
            anime: values.anime,
            img: values.img,
            price: values.price,
            stock: true,
            tallas: [values.tallaChica, values.tallaMediana, values.tallaGrande],
            tipo: values.tipo.name
        }, product.idItem).then(res => {
            showSuccess()
            window.location.href = "/dashboard/productos";
        }).catch(error => {
            showError();
        })

    }

    useEffect(() => {
      if(product){
        setImageUploaded(product.img)
      }
    }, [product])
    

    if (isLoading) {
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card p-fluid">
                        <h1>Cargando...</h1>
                    </div>
                </div>
            </div>
        )

    }

    if(product){
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card p-fluid">
                        <h5>Editar Producto #{product.idItem}</h5>
    
                        <Formik
                            initialValues={{
                                anime: product.anime,
                                img: product.img,
                                price: product.price,
                                stock: product.stock,
                                tallaChica: product.tallas[0],
                                tallaMediana: product.tallas[1],
                                tallaGrande: product.tallas[2],
                                tipo: {name: product.tipo, code: product.tipo},
                                title: product.title
                            }}
                            validationSchema={ProductoSchema}
                            onSubmit={onSubmit}
                        >
                            {
                                ({ errors, touched, values, handleChange, setFieldValue }) => (
                                    <Form>
                                        <div className="field">
                                            <label htmlFor="name">Nombre del producto</label>
                                            <InputText id="title" type="text" value={values.title} onChange={handleChange} />
                                            <ErrorMesage errors={errors} touched={touched} name='title' />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="price">Costo</label>
                                            <InputText id="price" type="number" value={"" + values.price} onChange={handleChange} />
                                            <ErrorMesage errors={errors} touched={touched} name='price' />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="anime">Anime</label>
                                            <InputText id="anime" type="text" value={values.anime} onChange={handleChange} />
                                            <ErrorMesage errors={errors} touched={touched} name='anime' />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="age1">Categoria</label>
                                            <Dropdown value={values.tipo} onChange={handleChange} options={tiposProductos} id="tipo" optionLabel="name" placeholder="Selecciona una categoria" className="w-full" />
                                            <ErrorMesage errors={errors} touched={touched} name='tipo' />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="age1">Imagen</label>
                                            <FileUpload
                                                name="image"
                                                accept="image/*"
                                                mode="basic"
                                                customUpload={true}
                                                uploadHandler={(e) => invoiceUploadHandler(e, setFieldValue)}
                                                maxFileSize={5000000}
                                                auto
                                                chooseLabel={loadingUpload ? "Cargando" : "Cargar"}
                                                className='mb-3'
                                            // customUpload={true}
                                            // uploadHandler={subirArchivo}
                                            />
                                            {imageUploaded !== "" &&
                                                <img src={imageUploaded} alt={imageUploaded} width="170" className="mt-0 mx-auto mb-5 block shadow-2" />
                                            }
                                            <ErrorMesage errors={errors} touched={touched} name='img' />
                                        </div>
                                        <div className='grid'>
                                            <div className="field col-12 md:col-4">
                                                <label htmlFor="age1">Stock en Chica</label>
                                                <InputText id="tallaChica" type="number" value={"" + values.tallaChica} onChange={handleChange} />
                                                <ErrorMesage errors={errors} touched={touched} name='tallaChica' />
                                            </div>
                                            <div className="field col-12 md:col-4">
                                                <label htmlFor="age1">Stock en Mediana</label>
                                                <InputText id="tallaMediana" type="number" value={"" + values.tallaMediana} onChange={handleChange} />
                                                <ErrorMesage errors={errors} touched={touched} name='tallaMediana' />
                                            </div>
                                            <div className="field col-12 md:col-4">
                                                <label htmlFor="age1">Stock en Grande</label>
                                                <InputText id="tallaGrande" type="number" value={"" + values.tallaGrande} onChange={handleChange} />
                                                <ErrorMesage errors={errors} touched={touched} name='tallaGrande' />
                                            </div>
                                        </div>
    
    
                                        <Button type='submit' label="Editar Producto" className="w-full p-3 text-xl mt-3" ></Button>
                                    </Form>
                                )
                            }
                        </Formik>
    
    
                    </div>
    
    
                </div>
    
                <Toast ref={toast} />
            </div>
        )
    }
    else{
        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card p-fluid">
                        <h1>No existe un producto con ese ID</h1>
                    </div>
                </div>
            </div>
        )
    }

    
}

export default EditarProducto