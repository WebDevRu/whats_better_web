import React, {
    ReactElement,
    useEffect,
} from 'react';
import { Spin, Layout as LayoutAnt } from 'antd';
import { useRouter } from 'next/router';
import styles from './Layout.module.less';
import { isRoleMatch } from '../../../utils/user/isRoleMatch';
import { UserRole } from '../../../const/user/USER_ROLES';
import { useApp } from '../../../context/AppContext';
import { useUser } from '../../../context/UserContext';
import { Sidebar } from '../../AdminPanel/Sidebar';

interface PropsInterface {
    children?: ReactElement | ReactElement[],
    redirectPath?: string,
    targetRole?: UserRole,
    roles?: UserRole | UserRole[],
    isHideMenu?: boolean
}

const Layout = (props:PropsInterface) => {
    const {
        children,
        redirectPath,
        roles,
        isHideMenu,
    } = props;

    const {
        appState,
    } = useApp();

    const {
        onGetMe,
    } = useUser();

    const router = useRouter();

    useEffect(() => {
        if (!appState?.isInit) {
            onGetMe();
        }
    }, [appState?.isInit]);

    useEffect(() => {
        if (!appState?.isInit || !redirectPath) {
            return;
        }
        if (roles && !isRoleMatch(appState.userRole, roles) && redirectPath) {
            router.push(redirectPath);
        }
    }, [
        appState?.isInit,
        appState?.userRole,
        roles,
        redirectPath,
        router.pathname
    ]);

    if (!appState?.isInit && roles || roles && !isRoleMatch(appState?.userRole, roles)) {
        return (
            <div className={styles.loaderContainer}>
                <Spin className={styles.spin}/>
            </div>
        );
    }

    return (
        <LayoutAnt style={{ minHeight: '100vh' }}>
            {!isHideMenu && (
                <Sidebar />
            )}
            {children}
        </LayoutAnt>
    );
};

export default Layout;
