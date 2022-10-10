import * as React from 'react';
import {
    useEffect,
    useState
} from 'react';
import {
    DataGrid, GridColDef, GridPreProcessEditCellProps, GridRenderCellParams,
    GridToolbarColumnsButton,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import {
    DeleteOutlined,
    EditOutlined,
    EmailOutlined,
    FileOpenOutlined,
    LinkedIn,
} from '@mui/icons-material/';
import {
    Chip,
    IconButton,
    LinearProgress, Select, SelectChangeEvent,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps
} from "@mui/material";
import './referralDataGrid.scss';
import {
    useFetchAllReferrals,
    useDeleteReferrals, useUpdateReferral
} from "../../services/referralService";
import useLocalStorage from "../storage/useLocalStorage";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "../../hooks/SnackBarProvider";
import {useGridApiContext} from "@mui/x-data-grid-pro";
import {useFetchAllRecruiters} from "../../services/userService";

type chipColor = "primary" | "success" | "error" | "default" | "secondary" | "info" | "warning" | undefined;
const statusOptions: ({ value: number; color: chipColor; label: string })[] = [
    {value: 0, label: 'Select one', color: 'default',},
    {value: 1, label: 'Recruitment', color: 'primary',},
    {value: 2, label: 'Interviewing', color: 'primary',},
    {value: 3, label: 'Managers ', color: 'primary',},
    {value: 4, label: 'Client ', color: 'primary',},
    {value: 5, label: 'Offer ', color: 'success',},
    {value: 6, label: 'Hiring ', color: 'success',},
    {value: 7, label: 'Failed ', color: 'error',}
];

const recruiters: ({ value: number, label: string })[] = [
    {value: 0, label: 'Select one'},
    {value: 1, label: 'Ana'},
    {value: 2, label: 'Jack'},
    {value: 3, label: 'Mary'},
    {value: 4, label: 'John'},
    {value: 5, label: 'Krish'},
    {value: 6, label: 'Navin'},
];

const LightTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
        </GridToolbarContainer>
    );
}

export default function ReferralDataGrid() {
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();
    const {fetchAllReferrals, isLoadingFetchAllReferrals} = useFetchAllReferrals();
    const {updateReferral} = useUpdateReferral();
    const {deleteReferral} = useDeleteReferrals();
    const {fetchAllRecruiters} = useFetchAllRecruiters();
    const [referrals, setReferrals] = useState<any>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const snackbar = useSnackbar();
    const handleClickCopyEmail = () => {
        snackbar.success('Email was copied successfully!')
    };

    const [recruitersList, setRecruitersList] = useState<any>([]);

    function SelectEditInputCell(props: GridRenderCellParams) {
        const {id, value, field} = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event: SelectChangeEvent) => {
            await apiRef.current.setEditCellValue({id, field, value: event.target.value});
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <Select
                value={value}
                onChange={handleChange}
                size="small"
                sx={{height: 1}}
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
        const {id, value, field} = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event: SelectChangeEvent) => {
            await apiRef.current.setEditCellValue({id, field, value: event.target.value});
            apiRef.current.stopCellEditMode({id, field});
        };

        return (
            <Select
                value={value}
                onChange={handleChange}
                size="small"
                sx={{height: 1}}
                autoFocus
                native
            >
                {recruitersList.map((ta: any) => {
                    return <option key={`${ta.id}-recruiters`} value={ta.id}>{ta.name}</option>;
                })}
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
        deleteReferral({id, token}).then(response => {
            handleFetchReferrals();
        }).catch(e => {
            console.log(e);
        })
    }

    const handleFetchRecruiters = () => {
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
            handleFetchRecruiters();
            handleFetchReferrals();
        }
    }, []);

    const referralDataGridColumns: GridColDef[] = [
        {
            field: "status",
            sortable: false,
            filterable: false,
            headerName: "Status",
            disableColumnMenu: true,
            hideable: false,
            headerAlign: "center",
            align: "center",
            flex: .2,
            minWidth: 150,
            editable: true,
            renderEditCell: renderSelectEditInputCell,
            renderCell: (params => {
                const status = statusOptions.find(x => x.value == params.formattedValue)

                return <Chip
                    className={'center'}
                    label={status?.label}
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
                    return {...params.props, error: false}
                }).catch(() => {
                    snackbar.error('Status cannot be updated. Try again', 'Referral');
                    return {...params.props, error: true}
                });
            },
        },
        {
            field: "full_name",
            headerName: "Full Name",
            headerAlign: "center",
            disableColumnMenu: true,
            hideable: false,
            flex: .6,
            minWidth: 200,
        },
        {
            field: "linkedin_url",
            sortable: false,
            filterable: false,
            headerName: "Linkedin",
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            flex: .2,
            minWidth: 74,
            renderCell: (params: any) => (
                <LightTooltip title="Click to open">
                    <IconButton className='icons' color="primary" component="button"
                                onClick={() => window.open(params.value, '_blank', 'noopener,noreferrer')}>
                        <LinkedIn/>
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
            flex: .2,
            minWidth: 30,
            renderCell: (params: any) => (
                <LightTooltip title="Click to open">
                    <IconButton className='icons' color="primary" component="button"
                                onClick={() => window.open(params.value, '_blank', 'noopener,noreferrer')}>
                        <FileOpenOutlined/>
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
            flex: .6,
            minWidth: 130
        },
        {
            field: "email",
            headerName: "Email",
            disableColumnMenu: true,
            hideable: false,
            headerAlign: "center",
            align: "center",
            flex: .6,
            minWidth: 254,
            renderCell: (params: any) => (
                <LightTooltip title={'Click to copy'}>
                    <span onClick={() => {
                        navigator.clipboard.writeText(params.value).then(r => handleClickCopyEmail())
                    }}>
                        <div className='email-icon'>
                                <IconButton className='icons' color="primary" component="button">
                                    <EmailOutlined/>
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
            filterable: false,
            headerName: "Tech Stacks",
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100,
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
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            flex: .5,
            minWidth: 160,
        },
        {
            field: "ta_recruiter",
            headerName: "T.A. Recruiter",
            headerAlign: "center",
            align: "center",
            flex: .5,
            minWidth: 160,
            editable: true,
            renderEditCell: renderSelectEditInputRecruitersCell,
            renderCell: (params => {
                const ta = recruitersList.find((ta: any) => ta.id == params.formattedValue);
                return ta.name;
            }),
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                snackbar.info('Updating...', 'Referral');

                return updateReferral({
                    referral: {
                        id: params.id,
                        taRecruiter: params.props.value
                    },
                    token
                }).then(() => {
                    snackbar.success('Referral Updated', 'Referral');
                    return {...params.props, error: false}
                }).catch(() => {
                    snackbar.error('Status cannot be updated. Try again', 'Referral');
                    return {...params.props, error: true}
                });
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            align: "center",
            hideable: false,
            flex: .4,
            minWidth: 80,
            renderCell: (params: any) => (
                <>
                    <IconButton
                        color="primary"
                        component="button"
                        onClick={() => history.push('/referrals/edit/' + params.id)}
                    >
                        <EditOutlined/>
                    </IconButton>
                    <IconButton
                        color="error"
                        component="button"
                        onClick={() => handleDelete(params.id)}
                    >
                        <DeleteOutlined/>
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            <DataGrid
                key="referralDataGrid"
                components={{
                    LoadingOverlay: LinearProgress,
                    Toolbar: CustomToolbar,
                }}
                rows={referrals}
                columns={referralDataGridColumns}
                getRowHeight={() => "auto"}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                loading={isLoadingFetchAllReferrals}
                experimentalFeatures={{newEditingApi: true}}
            />
        </>
    );
}
