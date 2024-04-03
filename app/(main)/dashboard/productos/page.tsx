/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import Link from 'next/link';
import { ProductType } from '@/types/response';
import useSWR from "swr"
import { useRouter } from 'next/navigation'
import { deleteProductos, descargarEtiquetas } from '@/services/producto/api';
import { useSession } from 'next-auth/react';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method

const fetcher = (url: string) => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`).then(res => res.json())

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    const { data: products, error, isLoading } = useSWR("productos/producto", fetcher)


    const [product, setProduct] = useState<ProductType | undefined>(undefined);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const confirm1 = () => {
        confirmDialog({
            message: '¿Estás seguro de eliminar productos?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: "Borrar",
            accept: () => { deleteProducto(), router.refresh() },
            reject: () => { }
        });
    };

    const downloadTags = () => {
        descargarEtiquetas("" + session?.user.token, { productos: selectedProducts });
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Link href="/dashboard/productos/agregar">
                        <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" />

                    </Link>
                    <Button label="Eliminar" icon="pi pi-trash" severity="danger" className=" mr-2" onClick={confirm1} disabled={!selectedProducts || !(selectedProducts as any).length} />
                    <Button label="Descargar etiquetas" icon="pi pi-tag" severity="info" onClick={downloadTags} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>

            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                #{rowData.idItem}
            </>
        );
    };


    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <img src={`${rowData.img}`} alt={"" + rowData.img} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const actionBodyTemplate = (rowData: ProductType) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => router.push(`/dashboard/productos/editar/${rowData.idItem}`)} />
            </>
        );
    };

    const stockBodyTemplate = (rowData: ProductType) => {
        return (
            <>
                {
                    rowData.tallas.map(talla => (
                        <p key={talla._id}>{talla.name}: {talla.count}</p>
                    ))
                }

            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>

        </div>
    );

    const deleteProducto = () => {
        deleteProductos("" + session?.user.token, { productos: selectedProducts })
    }

    return (
        <div className="grid crud-demo">
            <ConfirmDialog />
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {
                        isLoading ?
                            <p>Cargando productos...</p>
                            :
                            <DataTable
                                ref={dt}
                                value={products}
                                selection={selectedProducts}
                                onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                                dataKey="_id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                                globalFilter={globalFilter}
                                emptyMessage="No productos encontrados"
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="idItem" header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                                <Column field="title" header="Nombre" sortable headerStyle={{ minWidth: '12rem' }}></Column>
                                <Column field="anime" header="Anime" sortable headerStyle={{ minWidth: '12rem' }}></Column>
                                <Column header="img" body={imageBodyTemplate}></Column>
                                <Column field="price" header="Precio" body={priceBodyTemplate} sortable></Column>
                                <Column field="tipo" header="Categoria" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column header="Stock" sortable body={stockBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                    }


                </div>
            </div>
        </div>
    );
};

export default Crud;
