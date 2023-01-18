import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from "./img/apex_logo_white.svg";
import './navbar.scss';
import { Link, useHistory } from "react-router-dom";
import useLocalStorage from "../storage/useLocalStorage";
import { useFetchPermissions } from '../../services/userService';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const history = useHistory();
    const [token, setToken] = useLocalStorage('token', '');
    const logoutOnClick = () => {
        setToken('');
        history.replace('');
    }

    const { fetchPermissions } = useFetchPermissions();

    const [views, setViews] = useState<any>([
        {
            title: 'My referral',
            url: 'referrals',
        }
    ]);

    const userMenu = [
        {
            name: 'Profile',
            path: '/profile'
        },
        {
            name: 'Logout',
            onClick: logoutOnClick
        }
    ];
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        fetchPermissions(token).then(response => {
            if (response.permissions.find((x: any) => x.id === 13)) {
                setViews((current: any) => {
                    return [
                        ...current,
                        {
                            title: 'Users',
                            url: 'users',
                        }
                    ]
                });
            }
        });
    }, []);

    return (
        <AppBar position={"static"}>
            <Container className={"navbar"} maxWidth={false}>
                <Toolbar disableGutters>
                    <Box component={"div"} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                        <img
                            src={logo}
                            className={"apex-logo"}
                            alt="Apexlogo"
                            onClick={() => {
                                history.replace('/');
                            }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size={"large"}
                            aria-label={"account of current user"}
                            aria-controls={"menu-appbar"}
                            aria-haspopup={"true"}
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id={"menu-appbar"}
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {views.map((view: any) => (
                                <MenuItem key={view.url} onClick={handleCloseNavMenu}>
                                    <Typography textAlign={"center"}>
                                        <Link
                                            style={{ textDecoration: "none", color: "black" }}
                                            to={`/${view.url}`}>{view.title}</Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box component={"div"} sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
                        <img
                            src={logo}
                            className={"apex-logo-mobile"}
                            alt={"Apexlogo"}
                            onClick={() => {
                                history.replace('/');
                            }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {views.map((view: any) => (
                            <Button
                                key={view.url}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link style={{ textDecoration: "none", color: "white" }}
                                    to={`/${view.url}`}>{view.title}</Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title={"Open settings"}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={"Avatar"} src={"/static/images/avatar/2.jpg"} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id={"menu-appbar"}
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {userMenu.map((menu, index) => (
                                <MenuItem key={index} onClick={handleCloseUserMenu}>
                                    <Button onClick={menu.onClick}><Typography textAlign={"center"}>{menu.name}</Typography></Button>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navbar;
