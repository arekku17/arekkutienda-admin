export const getSeverity = (inventoryStatus: string) => {
    switch (inventoryStatus) {
        case 'Entregado':
            return 'success';

        case 'Pendiente':
            return 'warning';

        case 'Pagado':
            return 'info';

        case 'Cancelado':
            return 'danger';

        default:
            return null;
    }
};
