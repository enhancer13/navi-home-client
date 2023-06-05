import {StyleSheet, View} from "react-native";
import React, {useMemo} from "react";
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IUser} from "../../../../../BackendTypes";
import {MD3Theme as Theme, useTheme, Text} from "react-native-paper";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {toCapitalized} from "../../../../../Helpers/StringUtils";

export const User: React.FC<EntityViewComponentProps> = ({entity}) => {
    const user = entity as IUser;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderUserRoles = useMemo(() => {
        return <Text>{user.userRoles.map(userRole => toCapitalized(userRole.userRole)).join(',')}</Text>
    }, [user.userRoles]);

    return (
        <EntityViewContainer
            content={
                <View style={styles.rowContainer}>
                    <View style={styles.userContainer}>
                        <Text style={styles.usernameText}>{user.username}</Text>
                        <Text style={styles.emailText}>{user.email}</Text>
                        <Text style={styles.adminText}>{user.admin ? 'Admin' : 'Standard user'}</Text>
                        <View style={styles.userRolesContainer}>
                            {renderUserRoles}
                        </View>
                    </View>
                </View>
            }
        />
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userContainer: {
        flexGrow: 1,
        padding: 10
    },
    usernameText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    emailText: {
        color: theme.colors.onSurfaceVariant,
    },
    adminText: {
        color: theme.colors.primary,
        fontSize: 12,
        marginTop: 5
    },
    userRolesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    }
});
