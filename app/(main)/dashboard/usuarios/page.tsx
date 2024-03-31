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
import { deleteProductos } from '@/services/producto/api';
import { useSession } from 'next-auth/react';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method
import axios from 'axios';

const fetcher = (url: string, token: string) =>
    axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, { headers: { "x-access-token": token } })
        .then((res) => res.data);

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    const [product, setProduct] = useState<ProductType | undefined>(undefined);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    const { data: users, error, isLoading } = useSWR(["user", session?.user.token], ([url, token]) => fetcher(url, (token ? token : "")))

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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Link href="/dashboard/usuarios/agregar">
                        <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" />
                    </Link>
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
                #{rowData._id}
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
                            <p>Cargando usuarios...</p>
                            :
                            <DataTable
                                ref={dt}
                                value={users}
                                selection={selectedProducts}
                                onSelectionChange={(e) => 
                                    router.push(`/dashboard/usuario/${e.value.username}`)
                                }
                                selectionMode="single"
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
                                <Column field="id" header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                                <Column field="username" header="Nombre de usuario" sortable headerStyle={{ minWidth: '4rem' }}></Column>
                                <Column field="email" header="Correo" sortable headerStyle={{ minWidth: '4rem' }}></Column>
                            </DataTable>
                    }


                </div>
            </div>
        </div>
    );
};

export default Crud;
