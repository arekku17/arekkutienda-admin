'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { ProductType } from '@/types/response';
import ErrorMesage from '@/components/ErrorMesage';
import { Dropdown } from 'primereact/dropdown';


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
    idItem: Yup.string()
        .required('Id del item Requerido'),
    tallas: Yup.array()
        .required('Campo Requerido'),
    tipo: Yup.string()
        .required('Campo Requerido')

});

const AgregarProductos = () => {
    const [imageUploaded, setImageUploaded] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [url, setUrl] = useState("");
    const { data: session, status } = useSession()

    const tiposProductos = [
        { name: "playera", code: "playera" },
        { name: "llavero", code: "llavero" },
        { name: "sudadera", code: "sudadera" },
        { name: "poster", code: "poster" },
        { name: "botones", code: "boton" }
    ]


    const handleAgregarProducto = () => [

    ]

    const invoiceUploadHandler = async (event: any) => {
        // convert file to base64 encoded 
        const file = event.files[0];

        uploadInvoice(file)
    };

    const uploadInvoice = async (invoiceFile: any) => {
        let formData = new FormData();
        formData.append('image', invoiceFile);

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

        });
        setLoadingUpload(false)

    };

    const onSubmit = (values: ProductType) => {
        console.log(values)
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Agregar Producto</h5>

                    <Formik
                        initialValues={{
                            anime: '',
                            idItem: '',
                            img: '',
                            price: 0,
                            stock: true,
                            tallas: [],
                            tipo: "",
                            title: ""
                        }}
                        validationSchema={ProductoSchema}
                        onSubmit={onSubmit}
                    >
                        {
                            ({ errors, touched, values, handleChange, setFieldValue }) => (
                                <Form>
                                    <div className="field">
                                        <label htmlFor="name">Id</label>
                                        <InputText id="name" type="text" value={values.idItem} onChange={handleChange} />
                                        <ErrorMesage errors={errors} touched={touched} name='idItem' />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="name">Nombre</label>
                                        <InputText id="name" type="text" value={values.title} onChange={handleChange} />
                                        <ErrorMesage errors={errors} touched={touched} name='title' />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="email">Costo</label>
                                        <InputText id="costo" type="number" value={"" + values.price} onChange={handleChange} />
                                        <ErrorMesage errors={errors} touched={touched} name='price' />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="name">Anime</label>
                                        <InputText id="name" type="text" value={"" + values.anime} onChange={handleChange} />
                                        <ErrorMesage errors={errors} touched={touched} name='anime' />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="age1">Categoria</label>
                                        <Dropdown value={values.tipo} onChange={(e) => {
                                            setFieldValue('tipo', e.value);
                                        }} options={tiposProductos} optionLabel="name" placeholder="Selecciona una categoria" className="w-full" />
                                        <ErrorMesage errors={errors} touched={touched} name='tipo' />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="age1">Imagen</label>
                                        <FileUpload
                                            name="image"
                                            accept="image/*"
                                            mode="basic"
                                            customUpload={true}
                                            uploadHandler={invoiceUploadHandler}
                                            maxFileSize={5000000}
                                            auto
                                            chooseLabel={loadingUpload ? "Cargando" : "Cargar"}
                                            className='mb-3'
                                        // customUpload={true}
                                        // uploadHandler={subirArchivo}
                                        />
                                        {imageUploaded &&
                                            <img src={imageUploaded} alt={imageUploaded} width="170" className="mt-0 mx-auto mb-5 block shadow-2" />
                                        }
                                    </div>
                                    <div className='grid'>
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="age1">Stock en Chica</label>
                                            <InputText id="age1" type="text" />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="age1">Stock en Mediana</label>
                                            <InputText id="age1" type="text" />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="age1">Stock en Grande</label>
                                            <InputText id="age1" type="text" />
                                        </div>
                                    </div>


                                    <Button type='submit' label="Agregar Producto" className="w-full p-3 text-xl mt-3" onClick={handleAgregarProducto}></Button>
                                </Form>
                            )
                        }
                    </Formik>


                </div>


            </div>
        </div>
    )
}

export default AgregarProductos