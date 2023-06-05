import React from 'react';
import {EntityListScreen} from "../../../../../Features/EntityList/EntityListScreen";
import {EntityNames} from "../../../../../BackendTypes";
import {User} from "./User";

export const UsersScreen: React.FC = () => {
    return (
        <EntityListScreen
            entityName={EntityNames.User}
            EntityViewComponent={User}
            backButton={true}
        />
    );
}
