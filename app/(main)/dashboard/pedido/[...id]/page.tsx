/* eslint-disable @next/next/no-img-element */
'use client';

import { entregarPedido } from "@/services/pedido/api";
import { showError, showSuccess } from "@/utils/showToast";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import useSWR from "swr";

const fetcher = (url: string, token: string) =>
    axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, { headers: { "x-access-token": token } })
        .then((res) => res.data);

const Page = ({ params }: { params: { id: string } }) => {

    const { data: session, status } = useSession();
    const { data: pedido, error, isLoading } = useSWR([`pedido/producto/${params.id}`, session?.user.token], ([url, token]) => fetcher(url, (token ? token : "")))

    const toast = useRef(null);

    const router = useRouter();

    console.log(pedido)

    const handleEntregarPedido = () => {
        confirmDialog({
            message: '¿Estás seguro de entregar el pedido?',
            header: 'Confirmación de entrega',
            icon: 'pi pi-book',
            acceptLabel: "Sí",
            acceptClassName: 'p-button-success',
            accept: () => {
                entregarPedido(session?.user.token ? session?.user.token : "", pedido._id, "Entregado").then((res) => {
                    showSuccess("Acción correcta", "Se entregó correctamente el pedido", toast)
                }).catch(err => {
                    showError("Error", "Hubo un error al entregar el pedido", toast)
                })

            },
            reject: () => { }
        });
    }

    const handlePagarPedido = () => {
        confirmDialog({
            message: '¿Estás seguro de pagar el pedido?',
            header: 'Confirmación de pagado',
            icon: 'pi pi-book',
            acceptLabel: "Sí",
            acceptClassName: 'p-button-success',
            accept: () => {
                entregarPedido(session?.user.token ? session?.user.token : "", pedido._id, "Pagado").then((res) => {
                    showSuccess("Acción correcta", "Se entregó correctamente el pedido", toast)
                }).catch(err => {
                    showError("Error", "Hubo un error al entregar el pedido", toast)
                })

            },
            reject: () => { }
        });
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="col-12">
                <div className="card">
                    <h2>Pedido num. #{params.id}</h2>
                </div>
            </div>
            {
                (isLoading || pedido === undefined) ? <>
                    <p>Cargando...</p>
                </> :
                    <>
                        <div className="col-12">
                            <div className="card">
                                <h3>Acciones al estado</h3>
                                <div>
                                    <div className="my-2">
                                        {
                                            pedido.estado === "Pendiente" && <>
                                                <Button label="Entregado" icon="pi pi-plus" severity="success" className=" mr-2" onClick={() => handleEntregarPedido()} />
                                                <Button label="Pagado" icon="pi pi-plus" severity="warning" className=" mr-2" onClick={() => { }} />
                                            </>
                                        }

                                        {
                                            pedido.estado === "Pagado" && <Button label="Entregado" icon="pi pi-plus" severity="success" className=" mr-2" onClick={() => { }} />
                                        }
                                        {
                                            pedido.estado === "Pendiente" && <>
                                                <Button label="Cancelar" icon="pi pi-trash" severity="danger" className=" mr-2" onClick={() => { }} />
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 lg:col-8">
                            {
                                pedido.productos.map((item: any) => (
                                    <div className="card grid p-4" key={item.producto.idItem}>
                                        <div className="col-2">
                                            <img src={item.producto.img} alt="Producto" className="w-full h-auto border-round" />
                                        </div>
                                        <div className="col-6 flex flex-column">
                                            <p className="font-bold text-1xl text-gray-500 mb-0">#{item.producto.idItem}</p>
                                            <p className="font-bold text-3xl mb-0">{item.producto.title}</p>
                                            <p className="text-2xl">Talla: {item.talla}</p>
                                        </div>
                                        <div className="col-4 flex flex-column align-items-end justify-content-between">
                                            <div className="flex flex-column align-items-end">
                                                <p className="text-xl mb-0 text-gray-600">CANTIDAD</p>
                                                <p className="font-bold text-3xl mt-0">x {item.cantidad}</p>
                                            </div>

                                            <p className="text-3xl">${(item.cantidad * item.costo)}</p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="col-12 lg:col-4">
                            <div className="card mb-0">
                                <h4>Detalles del pedido</h4>
                                <div className="flex align-items-center gap-3 mb-3">
                                    <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-money-bill text-green-500 text-xl" />
                                    </div>
                                    <div>
                                        <span className="block text-500 font-medium">Total del pedido</span>
                                        <div className="text-900 font-medium text-2xl">${pedido.costoTotal}</div>
                                    </div>
                                </div>
                                <div className="flex align-items-center gap-3 mb-3">
                                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-user text-blue-500 text-xl" />
                                    </div>
                                    <div>
                                        <span className="block text-500 font-medium">Usuario</span>
                                        <div className="text-900 font-medium text-2xl">{pedido.usuario.username}</div>
                                    </div>
                                </div>
                                <div className="flex align-items-center gap-3 mb-3">
                                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-angle-right text-purple-500 text-xl" />
                                    </div>
                                    <div>
                                        <span className="block text-500 font-medium">Estado</span>

                                        <div className="text-900 font-medium text-2xl">{pedido.estado}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }

        </div>
    );
};

export default Page;
