import { useEffect, useState } from 'react';
import {
    DataGrid, GridColDef,
    GridColumnMenuContainer,
    GridColumnMenuProps,
    GridFilterMenuItem,
    GridPreProcessEditCellProps,
    GridRenderCellParams,
    SortGridMenuItems,
} from '@mui/x-data-grid';
import {
    Comment,
    DeleteOutlined,
    EditOutlined,
    EmailOutlined,
    FileOpenOutlined,
    LinkedIn,
} from '@mui/icons-material/';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress, Select, SelectChangeEvent,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps,
    useMediaQuery,
    useTheme
} from "@mui/material";
import './referralDataGrid.scss';
import {
    useFetchAllReferrals,
    useDeleteReferrals,
    useUpdateReferral,
    useAssignRecruiter
} from "../../services/referralService";
import useLocalStorage from "../storage/useLocalStorage";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "../../hooks/SnackBarProvider";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { useFetchAllRecruiters } from "../../services/recruitersService";
import { useFetchPermissions } from '../../services/userService';

type chipColor = "primary" | "success" | "error" | "default" | "secondary" | "info" | "warning" | undefined;
const statusOptions: ({ value: number; color: chipColor; label: string })[] = [
    { value: 0, label: 'Select one', color: 'default', },
    { value: 1, label: 'Recruitment', color: 'primary', },
    { value: 2, label: 'Interviewing', color: 'primary', },
    { value: 3, label: 'Managers ', color: 'primary', },
    { value: 4, label: 'Client ', color: 'primary', },
    { value: 5, label: 'Offer ', color: 'success', },
    { value: 6, label: 'Hiring ', color: 'success', },
    { value: 7, label: 'Failed ', color: 'error', }
];

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

function CustomColumnMenu(props: GridColumnMenuProps) {
    const { hideMenu, currentColumn, color, ...other } = props;

    return (
        <GridColumnMenuContainer
            hideMenu={hideMenu}
            currentColumn={currentColumn}
            {...other}
        >
            <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
            <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
        </GridColumnMenuContainer>
    );
}

export default function ReferralDataGrid() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();
    const { fetchAllReferrals, isLoadingFetchAllReferrals } = useFetchAllReferrals();
    const { updateReferral } = useUpdateReferral();
    const { assignRecruiter } = useAssignRecruiter();
    const { deleteReferral } = useDeleteReferrals();
    const { fetchAllRecruiters } = useFetchAllRecruiters();
    const [referrals, setReferrals] = useState<any>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const snackbar = useSnackbar();
    const handleClickCopyEmail = () => {
        snackbar.success('Email was copied successfully!')
    };
    const [referralComments, setReferralComments] = useState<any>({});

    const [recruitersList, setRecruitersList] = useState<any>([]);
    const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState<boolean>(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState<boolean>(false);
    const [idToBeDeleted, setIdToBeDeleted] = useState<number>();

    // PERMISSIONS
    const { fetchPermissions, isSuccesFetchPermissions } = useFetchPermissions();
    const [permissions, setPermissions] = useState<any>([]);

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
                {statusOptions.map(st => {
                    return <option key={`${st.value}-status`} value={st.value}>{st.label}</option>
                })}
            </Select>
        );
    }

    const renderSelectEditInputCell: GridColDef['renderCell'] = (params) => {
        return <SelectEditInputCell {...params} />;
    };

    function SelectEditInputRecruitersCell(props: GridRenderCellParams) {
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
                {
                    recruitersList.map((ta: any) => {
                        return <option key={`${ta.id}-recruiters`} value={ta.id}>{ta.name}</option>;
                    })
                }
            </Select>
        );
    }

    const renderSelectEditInputRecruitersCell: GridColDef['renderCell'] = (params) => {
        return <SelectEditInputRecruitersCell {...params} />;
    };

    const handleFetchReferrals = () => {
        fetchAllReferrals(token).then(response => {
            setReferrals(response);
        }).catch(e => {
            console.log(e);
            if (e.response.status === 401) {
                setToken('');
                history.replace('');
            }
        });
    }

    const handleDelete = (id: any) => {
        deleteReferral({ id, token }).then(response => {
            handleFetchReferrals();
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            setIdToBeDeleted(undefined);
        });
    }

    const handleFetchRecruiters = async () => {
        return fetchAllRecruiters(token).then((response) => {
            const recruiters = [
                {
                    id: 0,
                    name: 'Select one'
                },
                ...response,
            ]
            setRecruitersList(recruiters);
        }).catch((e) => {
            snackbar.error(e.message, 'Referrals');
        })
    }

    useEffect(() => {
        if (token === '') {
            setToken('');
            history.replace('');
        } else {
            fetchPermissions(token).then((response: any) => {
                setPermissions(response.permissions);
                handleFetchRecruiters();
                handleFetchReferrals();
            })
        }
    }, []);

    const referralDataGridColumns: GridColDef[] = [
        {
            field: "status",
            headerName: "Status",
            hideable: false,
            sortable: true,
            headerAlign: "center",
            align: "center",
            flex: .1,
            minWidth: 150,
            editable: Boolean(permissions.find((x: any) => x.id === 11 || x.id === 32)),
            renderEditCell: renderSelectEditInputCell,
            renderCell: (params => {
                const status = statusOptions.find(x => x.value === params.row.status)
                return <Chip
                    className={'center'}
                    label={status?.label ?? 'Loading'}
                    size={'small'}
                    variant={'outlined'}
                    color={status?.color}
                />;
            }),
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                snackbar.info('Updating...', 'Referral');
                return updateReferral({
                    referral: {
                        id: params.id,
                        status: params.props.value
                    },
                    token
                }).then(() => {
                    snackbar.success('Referral Updated', 'Referral');
                    handleFetchReferrals();
                    return { ...params.props, error: false }
                }).catch(({ response }) => {
                    if (response.status === 401) {
                        snackbar.error('Unauthorized', 'Referral');
                    } else {
                        snackbar.error('Status cannot be updated. Try again', 'Referral');
                    }

                    return { ...params.props, error: true }
                });
            },
            valueGetter: (params) => {
                const status = statusOptions.find(x => x.value === params.value);

                return status?.label;
            },
        },
        {
            field: "full_name",
            headerName: "Full Name",
            headerAlign: "center",
            hideable: false,
            flex: 1,
            minWidth: 200,
            filterable: true,
        },
        {
            field: "linkedin_url",
            sortable: false,
            filterable: false,
            headerName: "Linkedin",
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            flex: .1,
            minWidth: 100,
            renderCell: (params: any) => (
                <LightTooltip title="Click to open">
                    <IconButton className='icons' color="primary" component="button"
                        onClick={() => window.open(params.value, '_blank', 'noopener,noreferrer')}>
                        <LinkedIn />
                    </IconButton>
                </LightTooltip>
            ),
        },
        {
            field: "cv_url",
            sortable: false,
            filterable: false,
            headerName: "CV",
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            flex: .1,
            minWidth: 50,
            renderCell: (params: any) => (
                <LightTooltip title="Click to open">
                    <IconButton className='icons' color="primary" component="button"
                        onClick={() => window.open(params.value, '_blank', 'noopener,noreferrer')}>
                        <FileOpenOutlined />
                    </IconButton>
                </LightTooltip>
            ),
        },
        {
            field: "phone_number",
            headerName: "Phone",
            disableColumnMenu: true,
            hideable: false,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150
        },
        {
            field: "email",
            headerName: "Email",
            filterable: true,
            hideable: false,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 260,
            renderCell: (params: any) => (
                <LightTooltip title={'Click to copy'}>
                    <span onClick={() => {
                        navigator.clipboard.writeText(params.value).then(r => handleClickCopyEmail())
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
            field: "tech_stacks",
            sortable: false,
            filterable: true,
            headerName: "Tech Stacks",
            headerAlign: "center",
            align: "center",
            flex: 3,
            minWidth: 300,
            renderCell: (params: any) => {
                return <div className='tech_tag_container'>
                    {params.formattedValue.map((tech: string, index: number) => (
                        <span key={'techStacks_' + index} className='tag'>{tech}</span>))}
                </div>
            },
        },
        {
            field: "referred_by_name",
            headerName: "Referred By",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 160,
        },
        {
            field: "ta_recruiter",
            headerName: "T.A. Recruiter",
            headerAlign: "center",
            align: "center",
            filterable: true,
            flex: 1,
            hideable: false,
            minWidth: 160,
            editable: true,
            renderEditCell: renderSelectEditInputRecruitersCell,
            renderCell: (params => {
                const ta = recruitersList.find((ta: any) => ta.id === params.row.ta_recruiter);
                return ta?.name ?? 'Loading';
            }),
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                snackbar.info('Updating...', 'Referral');

                return assignRecruiter({
                    request: {
                        referralId: params.id,
                        taId: params.props.value
                    },
                    token
                }).then(() => {
                    snackbar.success('TA assigned', 'Referral');
                    handleFetchReferrals();
                    return { ...params.props, error: false }
                }).catch(({ response }) => {
                    if (response.status === 401) {
                        snackbar.error('Unauthorized', 'Referral');
                    } else {
                        snackbar.error('TA cannot be assigned. Try again', 'Referral');
                    }

                    return { ...params.props, error: true }
                });
            },
            valueGetter: (params) => {
                const ta = recruitersList.find((ta: any) => ta.id === params.value);

                return ta?.name;
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            align: "center",
            hideable: false,
            flex: .8,
            minWidth: 120,
            renderCell: (params: any) => (
                <>
                    <LightTooltip title="Edit referral">
                        <IconButton
                            color="primary"
                            component="button"
                            onClick={() => history.push('/referrals/edit/' + params.id)}
                        >
                            <EditOutlined />
                        </IconButton>
                    </LightTooltip>
                    <LightTooltip title="View comments">
                        <IconButton
                            color="primary"
                            component="button"
                            onClick={() => {
                                setReferralComments({
                                    referralName: params.row.full_name,
                                    comments: params.row.comments !== '' ? params.row.comments : 'No comments'
                                });

                                setIsCommentsDialogOpen(true);
                            }}
                        >
                            <Comment />
                        </IconButton>
                    </LightTooltip>
                    {permissions.find((x: any) => x.id === 11) && <LightTooltip title="Delete referral">
                        <IconButton
                            color="error"
                            component="button"
                            onClick={() => {
                                setIdToBeDeleted(params.row.id)
                                setIsDeleteConfirmDialogOpen(true);
                            }}
                        >
                            <DeleteOutlined />
                        </IconButton>
                    </LightTooltip>}
                </>
            ),
        },
    ];

    return (
        <>
            {isSuccesFetchPermissions && permissions.length > 0 && <DataGrid
                key="referralDataGrid"
                components={{
                    LoadingOverlay: LinearProgress,
                    ColumnMenu: CustomColumnMenu
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            // Hide columns status and traderName, the other columns will remain visible
                            ta_recruiter: Boolean(permissions?.find((x: any) => {
                                return x.id === 11 || x.id === 33
                            }))
                        }
                    },
                }}
                rows={referrals}
                columns={referralDataGridColumns}
                getRowHeight={() => "auto"}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                loading={isLoadingFetchAllReferrals}
                experimentalFeatures={{ newEditingApi: true }}
            />}

            {/* Dialog for Comments */}
            <Dialog
                fullScreen={fullScreen}
                open={isCommentsDialogOpen}
                onClose={() => setIsCommentsDialogOpen(false)}
                aria-labelledby="permission-dialog-title"
            >
                <DialogTitle id="permission-dialog-title">
                    {`Comments for ${referralComments.referralName}`}
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    {referralComments.comments}
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ color: "#44546A", borderColor: "#44546A", ":hover": { borderColor: "white", color: "white", backgroundColor: "#44546A" } }}
                        variant={"outlined"}
                        onClick={() => setIsCommentsDialogOpen(false)}
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Confirm delete */}
            <Dialog
                fullScreen={fullScreen}
                open={isDeleteConfirmDialogOpen}
                onClose={() => setIsDeleteConfirmDialogOpen(false)}
                aria-labelledby="permission-dialog-title"
            >
                <DialogTitle id="permission-dialog-title">
                    Delete confirmation
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    Are you sure you want to remove this referral?
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ color: "#44546A", borderColor: "#44546A", ":hover": { borderColor: "white", color: "white", backgroundColor: "#44546A" } }}
                        variant={"outlined"}
                        onClick={() => setIsDeleteConfirmDialogOpen(false)}
                        autoFocus
                    >
                        Close
                    </Button>
                    <Button
                        color='error'
                        variant={"outlined"}
                        onClick={() => {
                            handleDelete(idToBeDeleted);
                            setIsDeleteConfirmDialogOpen(false)
                        }}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
