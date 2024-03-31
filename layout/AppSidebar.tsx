import { Suspense } from 'react';
import AppMenu from './AppMenu';

const AppSidebar = () => (
    <Suspense>
        <AppMenu />
    </Suspense>
);

export default AppSidebar;
