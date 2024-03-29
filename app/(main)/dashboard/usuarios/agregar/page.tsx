'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from "yup";
import { ProductSchemaType, ProductType } from '@/types/response';
import ErrorMesage from '@/components/ErrorMesage';
import { Dropdown } from 'primereact/dropdown';
import { postProductos } from '@/services/producto/api';

import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation'



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
    tallas: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string(),
                mount: Yup.number(),
            })
        )
        .required()
        .min(1),
    tipo: Yup.object()
        .required('Campo Requerido')

});

const AgregarProductos = () => {
    const [imageUploaded, setImageUploaded] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [url, setUrl] = useState("");
    const { data: session, status } = useSession();
    const toast = useRef<Toast>(null);
    const router = useRouter();


    const tiposProductos = [
        { name: "playera", code: "playera" },
        { name: "llavero", code: "llavero" },
        { name: "sudadera", code: "sudadera" },
        { name: "poster", code: "poster" },
        { name: "botones", code: "boton" }
    ]

    const showSuccess = () => {
        toast.current?.show({ severity: 'success', summary: 'Agregado exitoso', detail: 'Se agregó exitosamente el producto', life: 3000 });
    }

    const showError = () => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al generar el producto', life: 3000 });
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
        postProductos("" + session?.user.token, {
            title: values.title,
            anime: values.anime,
            img: values.img,
            price: values.price,
            stock: true,
            tallas: values.tallas,
            tipo: values.tipo.name
        }).then(res => {
            showSuccess();
            router.push("/dashboard/productos")
        }).catch(error => {
            showError();
        })

    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Agregar Usuario</h5>

                    <Formik
                        initialValues={{
                            anime: '',
                            img: imageUploaded,
                            price: 0,
                            stock: true,
                            tallas: [],
                            tipo: { code: "", name: "" },
                            title: ""
                        }}
                        validationSchema={ProductoSchema}
                        onSubmit={onSubmit}
                    >
                        {
                            ({ errors, touched, values, handleChange, setFieldValue, handleSubmit }) => (
                                <Form>
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
                                    <div className='field'>
                                        <label htmlFor="tallas">Tallas</label>
                                        <FieldArray
                                            name="tallas"
                                            render={arrayHelpers => (
                                                <div className='w-full'>
                                                    {values.tallas.map((talla, index) => (
                                                        <div key={index} className='grid w-full'>
                                                            {/** both these conventions do the same */}
                                                            <div className='flex flex-column gap-2 col-5'>
                                                                <label htmlFor="tallas">Nombre</label>
                                                                <Field name={`tallas[${index}].name`} type="text"
                                                                    className="p-2"

                                                                />
                                                            </div>
                                                            <div className='flex flex-column gap-2 col-5'>
                                                                <label htmlFor="tallas">Cantidad</label>
                                                                <Field name={`tallas[${index}].count`} type="number"
                                                                    className="p-2"
                                                                    default="0"
                                                                />
                                                            </div>
                                                            <div className='col-2 flex align-items-end justify-content-end'>
                                                                <Button type='button' icon="pi pi-minus" className="w-3rem h-3rem"
                                                                    onClick={() => arrayHelpers.remove(index)}
                                                                    severity="danger"
                                                                />
                                                            </div>

                                                        </div>
                                                    ))}
                                                    <Button type='button' icon="pi pi-plus" label='AGREGAR TALLA' className="w-full"
                                                        onClick={() => arrayHelpers.push({ name: '', count: '' })}
                                                        severity="success" />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <ErrorMesage errors={errors} touched={touched} name='tallas' />


                                    <Button type='submit' label="Agregar Producto" className="w-full p-3 text-xl mt-3" onClick={handleSubmit}></Button>
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

export default AgregarProductos