import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {Surface} from 'react-native-paper';
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";

declare type Props = {
    content: ReactElement;
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}

export const EntityViewContainer: React.FC<Props> = ({content, onLayout}) => {
    return (
        <Surface elevation={1} style={styles.container} onLayout={onLayout}>
            <View style={styles.alarmProfileContainer}>
                {content}
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    alarmProfileContainer: {
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
});
