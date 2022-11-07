import { Alert, AlertColor, AlertTitle, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

interface SnackbarContextInterface {
    error: (newMessage: string, title?: string) => void;
    success: (newMessage: string, title?: string) => void;
    info: (newMessage: string, title?: string) => void;
}

export const SnackbarContext = createContext({} as SnackbarContextInterface);

type SnackbarProviderProps = {
    children: React.ReactNode;
};

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

    const handleClose = (
        event: React.SyntheticEvent<any> | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const error = (newMessage: string, title?: string) => {
        setTitle(title ?? 'Referral System');
        setMessage(newMessage);
        setSeverity('error');
        setOpen(true);
    };

    const success = (newMessage: string, title?: string) => {
        setTitle(title ?? 'Referral System');
        setMessage(newMessage);
        setSeverity('success');
        setOpen(true);
    };

    const info = (newMessage: string, title?: string) => {
        setTitle(title ?? 'Referral System');
        setMessage(newMessage);
        setSeverity('info');
        setOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ error, success, info }}>
            {children}
            <Snackbar
                key={message}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={severity}>
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export function useSnackbar() {
    return useContext(SnackbarContext);
}

export default SnackbarProvider;
