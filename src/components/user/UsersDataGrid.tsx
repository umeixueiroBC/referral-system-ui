import * as React from 'react';
import {
    useEffect,
    useState
} from 'react';
import {
    DataGrid,
    GridColDef,
    GridPreProcessEditCellProps,
    GridRenderCellParams,
    GridToolbarColumnsButton,
    GridToolbarContainer
} from '@mui/x-data-grid';
import { EmailOutlined, DeleteOutlined, Lock } from '@mui/icons-material/';
import {
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress, Select, SelectChangeEvent, styled,
    Tooltip, tooltipClasses, TooltipProps, useMediaQuery, useTheme
} from "@mui/material";
import { User } from "../../views/users/user";
import './usersDataGrid.scss';
import { useFetchAllUsers, useUpdateUser, useFetchAllRoles, useDeleteUser, useGetUserPermissions } from "../../services/userService";
import useLocalStorage from "../storage/useLocalStorage";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "../../hooks/SnackBarProvider";
import { useGridApiContext } from "@mui/x-data-grid-pro";

type chipColor = "primary" | "success" | "error" | "default" | "secondary" | "info" | "warning" | undefined;

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

const progress = (roleName: string | undefined): chipColor => {
    switch (roleName) {
        case 'TA':
            return roleName = 'primary';
        case 'ADMIN':
            return roleName = 'warning';
        default:
            return roleName = 'default';
    }
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
        </GridToolbarContainer>
    );
}

export default function UsersDataGrid() {
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();
    const snackbar = useSnackbar();
    const { fetchAllUsers, isLoadingFetchAllUsers } = useFetchAllUsers();
    const { fetchAllRoles } = useFetchAllRoles();
    const { deleteUser } = useDeleteUser();
    const { updateUser } = useUpdateUser();
    const [pageSize, setPageSize] = useState<number>(10);
    const [users, setUsers] = React.useState<any>([]);
    const [roles, setRoles] = React.useState<any>([]);
    const [openPermissionsDialog, setOpenPermissionsDialog] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [userPermissions, setUserPermissions] = useState<any>([]);

    const { getUserPermissions, isLoadingGetUserPermissions } = useGetUserPermissions();

    useEffect(() => {
        fetchAllRoles(token).then(response => {
            setRoles(handleCorrectDataRoles(response));
            handleFetchAllUsers();
        }).catch(e => {
            console.log(e);
            if (e.response.status === 401) {
                setToken('');
                history.replace('');
            }
        });
    }, []);

    const handleFetchAllUsers = async () => {
        try {
            const response = await fetchAllUsers(token);
            setUsers(handleCorrectData(response));
        } catch (e) {
            console.log(e);
        }
    }

    const handleClickCopyEmail = () => {
        snackbar.success('Email was copied successfully to your clipboard')
    };

    function SelectEditInputCell(props: GridRenderCellParams) {
        const { id, value, field } = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event: SelectChangeEvent) => {
            await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
            apiRef.current.stopCellEditMode({ id, field });
        };

        return (
            <Select
                value={value}
                onChange={handleChange}
                size="small"
                sx={{ height: 1 }}
                autoFocus
                native
            >
                <option key={'0-user'} value={'0'}>Select one</option>
                {
                    roles.map((roleStatus: any) => {
                        return (<option key={`${roleStatus.value}-role`} value={roleStatus.value}>{roleStatus.label}</option>)
                    })
                }
            </Select>
        );
    }

    const renderSelectEditRoleCell: GridColDef['renderCell'] = (params) => {
        return <SelectEditInputCell {...params} />;
    };

    const userDataGridColumns: any = [
        {
            field: "roleId",
            sortable: false,
            filterable: false,
            headerName: "Role",
            disableColumnMenu: true,
            hideable: false,
            headerAlign: 'center',
            align: "center",
            flex: .2,
            minWidth: 80,
            editable: true,
            renderEditCell: renderSelectEditRoleCell,
            renderCell: ((params: any) => {
                const role = roles.find((role: any) => role.value === params.formattedValue);

                return <Chip
                    className={'center'}
                    label={role?.label ?? 'Loading'}
                    size={'small'}
                    variant={'outlined'} color={progress(role?.label)}
                />;
            }),
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                snackbar.info('Updating...', 'Users');
                const mergedValues: any = (
                    {
                        roles: {
                            id: params.id,
                            roleId: parseInt(params.props.value)
                        },
                        token: token
                    }
                );
                updateUser(mergedValues).then(() => {
                    snackbar.success('Role Updated', 'Users');
                    handleFetchAllUsers();
                    return { ...params.props, error: false }
                }).catch(() => {
                    snackbar.error('Status cannot be updated. Try again', 'Users');
                    return { ...params.props, error: true }
                });
            }
        },
        {
            field: "fullName",
            headerName: "Full Name",
            disableColumnMenu: true,
            hideable: false,
            minWidth: 300,
            flex: 1
        },
        {
            field: "email",
            headerName: "Email",
            disableColumnMenu: true,
            hideable: false,
            minWidth: 300,
            flex: 1,
            renderCell: (params: any) => (
                <LightTooltip title={'Click to copy'}>
                    <span onClick={() => {
                        navigator.clipboard.writeText(params.value).then(() => handleClickCopyEmail())
                    }}>
                        <div className='email-icon'>
                            <IconButton className='icons' color="primary" component="button">
                                <EmailOutlined />
                            </IconButton>
                            {params.value}
                        </div>
                    </span>
                </LightTooltip>
            ),
        },
        {
            field: "actions",
            type: 'actions',
            headerName: "Actions",
            hideable: false,
            minWidth: 120,
            flex: .2,
            renderCell: (params: any) => (
                <>
                    <LightTooltip title="View permissions">
                        <IconButton
                            color="primary"
                            component="button"
                            onClick={() => {
                                setOpenPermissionsDialog(true);
                                setUserPermissions({
                                    role: 'Loading...'
                                });
                                getUserPermissions({
                                    userId: params.id,
                                    token
                                }).then((response) => {
                                    setUserPermissions({
                                        role: roles.find((role: any) => role.value === params.row.roleId).label ?? 'Unknown',
                                        permissions: response.permissions
                                    });
                                });
                            }}
                        >
                            <Lock />
                        </IconButton>
                    </LightTooltip>
                    <LightTooltip title="Delete user">
                        <IconButton
                            color="error"
                            component="button"
                            onClick={() => handleDelete(params.id)}
                        >
                            <DeleteOutlined />
                        </IconButton>
                    </LightTooltip>
                </>
            ),
        },
    ];

    const handleDelete = (id: any) => {
        snackbar.info('Deleting...', 'Users');
        deleteUser({ id, token }).then(async () => {
            snackbar.success('Deleted successfully', 'Users');
            await handleFetchAllUsers();
        }).catch(e => {
            snackbar.error('Something went wrong, Please try again', 'Users');
            console.log(e);
        })
    }

    const handleCorrectDataRoles = (roles: any) => {
        return roles.map((data: any) => {
            return {
                value: data.id,
                label: data.name
            }
        });
    }

    const handleCorrectData = (users: any): User[] => {
        return users.map((data: any) => {
            return {
                id: data.id,
                fullName: data.name,
                email: data.email,
                roleId: data.role_id,
                roleName: roles.has && roles.has(data.role_id) ? roles.get(data.role_id).toLowerCase() : 'Undefined',
                permissions: ['View', 'Edit']
            }
        });
    }

    const handleClosePermissionsDialog = () => {
        setOpenPermissionsDialog(false);
    };

    return (
        <>
            <DataGrid
                key="referralDataGrid"
                components={{
                    LoadingOverlay: LinearProgress,
                    Toolbar: CustomToolbar,
                }}
                rows={users}
                columns={userDataGridColumns}
                getRowHeight={() => "auto"}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                loading={isLoadingFetchAllUsers}
                experimentalFeatures={{ newEditingApi: true }}
            />

            <Dialog
                fullScreen={fullScreen}
                open={openPermissionsDialog}
                onClose={handleClosePermissionsDialog}
                aria-labelledby="permission-dialog-title"
            >
                <DialogTitle id="permission-dialog-title">
                    {`${userPermissions.role} Permissions:`}
                </DialogTitle>
                <DialogContent sx={{textAlign: 'center'}}>
                    {isLoadingGetUserPermissions && <CircularProgress color="primary" />}
                    {!isLoadingGetUserPermissions && <Grid container maxWidth="sm">
                        <Grid item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {userPermissions?.permissions?.map((permission: any, index: number) => {
                                return <div key={`${index}-permission-div`} style={{ margin: '0 5px 10px 5px' }}>
                                    <Chip
                                        sx={{ fontWeight: 'bold', backgroundColor: "#44546A" }}
                                        key={`${index}-permission-chip`}
                                        className={'center'}
                                        label={permission.label}
                                        size={'medium'}
                                        color={'primary'}
                                        variant={'filled'}
                                    />
                                </div>
                            })}
                        </Grid>
                    </Grid>}
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ color: "#44546A", borderColor: "#44546A", ":hover": { borderColor: "white", color: "white", backgroundColor: "#44546A" } }}
                        variant={"outlined"}
                        onClick={handleClosePermissionsDialog}
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
