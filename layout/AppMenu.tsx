/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: 'Herramientas',
            items: [
                { label: 'Productos', icon: 'pi pi-fw pi-list', to: '/dashboard/productos' },
                { label: 'Usuarios', icon: 'pi pi-fw pi-user', to: '/dashboard/usuarios' },
                { label: 'Pedidos', icon: 'pi pi-fw pi-shopping-cart', to: '/dashboard/pedidos' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

               
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
