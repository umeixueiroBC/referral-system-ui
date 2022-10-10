import {Button, Container, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import useLocalStorage from "../../components/storage/useLocalStorage";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Login = () => {
    const [token, setToken] = useLocalStorage('token', '');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const handleLogin = () => {
        window.location.href = "https://referral-system-api.onrender.com/auth/azure_oauth2";
    }

    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        const tokenFromQuery = query.get('token');

        if (tokenFromQuery) {
            setToken(tokenFromQuery);
            history.push('referrals')
        } else if (token) {
            history.push('referrals')
        }
    });

    return <>
        { !isLoggedIn && <Container fixed sx={{marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={'/logoApex.png'} alt={'logoApex'}/>
            <Typography component="p" sx={{fontSize: '3em', fontFamily: 'Libre Franklin, sans-serif', fontWeight: '600', color: '#44546a'}}>
                Referral System
            </Typography>
            <Button
                variant="contained"
                sx={{marginTop: '20px', backgroundColor: '#44546a', fontSize: '1em', ":hover": {backgroundColor: '#BAC4CD'}}}
                onClick={handleLogin}

            >
                Login
            </Button>
        </Container> }
    </>
}

export default Login;
