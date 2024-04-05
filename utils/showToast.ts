export const showSuccess = (titulo: string, mensaje: string, toast: any) => {
    toast.current.show({ severity: 'success', summary: titulo, detail: mensaje, life: 3000 });
}

export const showError = (titulo: string, mensaje: string, toast: any) => {
    toast.current.show({ severity: 'error', summary: titulo, detail: mensaje, life: 3000 });
}
