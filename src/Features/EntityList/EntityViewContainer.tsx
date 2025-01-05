import React from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {LayoutChangeEvent} from 'react-native/Libraries/Types/CoreEventTypes';

declare type EntityViewContainerProps = {
    children: React.ReactNode;
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
};

export const EntityViewContainer: React.FC<EntityViewContainerProps> = ({children, onLayout}) => {
    return (
        <Surface elevation={1} style={styles.container} onLayout={onLayout}>
            {children}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 3,
        width: '95%',
    },
});
