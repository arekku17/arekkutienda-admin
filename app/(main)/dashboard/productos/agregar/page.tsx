'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext'
import React, { useRef, useState } from 'react'

const AgregarProductos = () => {
    const [imageUploaded, setImageUploaded] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [url, setUrl] = useState("");
    const { data: session, status } = useSession()


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
            setUrl( res.data.url)
            setImageUploaded(res.data.url)

        });
        setLoadingUpload(false)

    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Agregar Producto</h5>
                    <div className="field">
                        <label htmlFor="name">Id</label>
                        <InputText id="name" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="name">Nombre</label>
                        <InputText id="name" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Costo</label>
                        <InputText id="costo" type="number" />
                    </div>
                    <div className="field">
                        <label htmlFor="name">Anime</label>
                        <InputText id="name" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Categoria</label>
                        <InputText id="age1" type="text" />
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
                    <div className="field">
                        <label htmlFor="age1">Tallas</label>
                        <InputText id="age1" type="text" />
                    </div>

                    <Button label="Agregar Producto" className="w-full p-3 text-xl mt-3" onClick={handleAgregarProducto}></Button>
                </div>


            </div>
        </div>
    )
}

export default AgregarProductos