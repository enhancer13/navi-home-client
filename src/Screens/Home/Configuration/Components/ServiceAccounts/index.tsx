import React from 'react';
import {EntityListScreen} from "../../../../../Features/EntityList/EntityListScreen";
import {EntityNames} from "../../../../../BackendTypes";
import {ServiceAccount} from "../FirebaseAccounts/ServiceAccount";

export const FirebaseAccountsScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.ServiceAccount}
            EntityViewComponent={ServiceAccount}
            backButton={true}
        />
    );
}
