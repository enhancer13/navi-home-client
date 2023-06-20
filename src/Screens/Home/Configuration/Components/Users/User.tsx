import {StyleSheet, View} from "react-native";
import React, {useMemo} from "react";
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IUser} from "../../../../../BackendTypes";
import {MD3Theme as Theme, useTheme, Text, Divider} from "react-native-paper";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {toCapitalized} from "../../../../../Helpers/StringUtils";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const User: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const user = entity as IUser;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderUserRoles = useMemo(() => {
        return <Text variant={'labelLarge'}>{user.userRoles.map(userRole => toCapitalized(userRole.userRole)).join(', ')}</Text>
    }, [user.userRoles]);

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer
            content={
                <View style={styles.container}>
                    <View style={styles.primaryIconContainer}>
                        <FontAwesome name={'user-circle'} color={theme.colors.primary} size={primaryIconSize}/>
                        <Text style={styles.adminText}>{user.admin ? 'Admin' : 'Standard user'}</Text>
                    </View>
                    <View style={styles.serviceAccountContainer}>
                        <Text variant={'titleMedium'}>{user.username}</Text>
                        <Text variant={'labelLarge'}>{user.email}</Text>
                        <Divider style={styles.divider}/>
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
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryIconContainer: {
        alignItems: 'center'
    },
    serviceAccountContainer: {
        flexGrow: 1,
        padding: 10
    },
    adminText: {
        color: theme.colors.primary,
        marginTop: 5,
        alignSelf: 'center'
    },
    userRolesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    divider: {
        marginVertical: 10
    }
});
