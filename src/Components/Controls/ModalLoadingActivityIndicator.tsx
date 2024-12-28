import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Portal} from 'react-native-paper';

type LoadingIndicatorProps = {
    visible: boolean;
};

export const ModalLoadingActivityIndicator: React.FC<LoadingIndicatorProps> = ({visible}) => {
    return (
        <Portal>
            <Modal visible={visible} transparent={true} onRequestClose={() => undefined}>
                <View style={styles.modalContainer}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
