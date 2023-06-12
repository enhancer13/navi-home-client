import {StyleSheet, View} from "react-native";
import React, {useMemo} from "react";
import {EntityViewComponentProps} from "../../../../../Features/EntityList/EntityListScreen";
import {IServiceAccount} from "../../../../../BackendTypes";
import {MD3Theme as Theme, useTheme, Text, Divider} from "react-native-paper";
import {EntityViewContainer} from "../../../../../Features/EntityList/EntityViewContainer";
import {snakeToPascal} from "../../../../../Helpers/StringUtils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {IconTextItem} from "../../../../../Components/Controls";

export const ServiceAccount: React.FC<EntityViewComponentProps> = ({entity, width}) => {
    const serviceAccount = entity as IServiceAccount;
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const primaryIconSize = width / 10;

    return (
        <EntityViewContainer
            content={
                <View style={styles.rowContainer}>
                    <View style={styles.primaryIconContainer}>
                        <MaterialCommunityIcons name={'account-group'} color={theme.colors.primary}
                                                size={primaryIconSize}/>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.serviceAccountContainer}>
                            <Text variant={'titleMedium'}>{serviceAccount.accountName}</Text>
                            <Divider style={styles.divider}/>
                            <IconTextItem labelText={'Account type'} valueText={snakeToPascal(serviceAccount.serviceAccountType)}/>
                            <IconTextItem labelText={'Linked user'} valueText={serviceAccount.user?.username}/>
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
    },
    text: {
        marginVertical: 2,
    },
    bold: {
        fontWeight: 'bold'
    },
});
