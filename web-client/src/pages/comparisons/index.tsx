import React from 'react';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NS_COMMON, NS_ADMIN_PANEL } from '../../const/NAMESPACES';
import { Layout } from '../../component/Common/Layout';
import { UserRoles } from '../../const/user/USER_ROLES';
import { LOGIN } from '../../const/http/WEB_CLIENT_PATHS';
import { ComparisonsContainer } from '../../container/ComparisonsContainer';

const ComparisonEntities: NextPage = () => {
    return (
        <Layout
            roles={UserRoles.Admin}
            redirectPath={LOGIN}
        >
            <ComparisonsContainer />
        </Layout>
    );
};


export const getServerSideProps = async ({ locale }:{ locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, [NS_COMMON, NS_ADMIN_PANEL])),
        locale
    },
});


export default ComparisonEntities;