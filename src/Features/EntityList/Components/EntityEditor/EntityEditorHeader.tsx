import React, {useMemo} from "react";
import {Animated} from "react-native";
import {Button} from "react-native-paper";
import {AppHeader} from "../../../../Components/Layout";

type EntityEditorHeaderProps = {
    title: string;
    onCancel: () => void;
    onDone: () => void;
    scrollY: Animated.Value;
    scrollThreshold: number;
}

export const EntityEditorHeader: React.FC<EntityEditorHeaderProps> = ({
                                                        title,
                                                        onCancel,
                                                        onDone,
                                                        scrollY,
                                                        scrollThreshold
                                                    }) => {
    const cancelIconButton = useMemo(() => {
        return <Button icon="cancel" mode="text" onPress={onCancel}>Cancel</Button>
    }, [onCancel]);

    const doneIconButton = useMemo(() => {
        return <Button icon="content-save-edit-outline" mode="text" onPress={onDone}>Done</Button>
    }, [onDone]);

    return (
        <AppHeader
            title={title}
            leftControl={cancelIconButton}
            rightControl={doneIconButton}
            enableTitleAnimation={true}
            scrollY={scrollY}
            scrollThreshold={scrollThreshold}
        />
    );
}
