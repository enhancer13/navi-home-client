import React, {createContext, useContext, useState} from "react";

interface DialogContextType {
    dialog: React.ReactElement | null;
    openDialog: <T extends React.ComponentType<any>>(
        component: T,
        getProps: () => React.ComponentProps<T>,
    ) => void;
    closeDialog: () => void;
}

type DialogProviderProps = {
    children: React.ReactNode;
};

export interface DialogContentProps {
    title: string;
    message?: string;
    onCancel?: () => void;
}

const DialogContext = createContext<DialogContextType>({
    dialog: null,
    openDialog: () => undefined,
    closeDialog: () => undefined
});

export const DialogProvider: React.FC<DialogProviderProps> = ({children}) => {
    const [dialog, setDialog] = useState<React.ReactElement | null>(null);

    const openDialog = <T extends React.ComponentType<any>>(
        component: T,
        getProps: () => React.ComponentProps<T>,
    ) => {
        const props = getProps();
        const {onConfirm, onCancel} = props;
        const handleConfirm = (arg?: any) => {
            if (onConfirm) {
                (onConfirm as any)(arg);
            }
            console.debug('handleConfirm')
            closeDialog();
        };
        setDialog(React.createElement(component, {...props, onConfirm: handleConfirm, onCancel: onCancel || closeDialog}));
    };

    const closeDialog = () => {
        setDialog(null);
    };

    return (
        <DialogContext.Provider value={{dialog, openDialog, closeDialog}}>
            {children}
            {dialog}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);
