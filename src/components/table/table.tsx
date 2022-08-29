import './table.scss';
import * as React from 'react';
import {useState} from "react";
import {Link} from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutlined, EditOutlined, EmailOutlined, FileOpenOutlined, LinkedIn } from '@mui/icons-material/';
import { 
    Box, 
    Chip,
    IconButton,
    Stack
} from "@mui/material";

export default function ApexTable() {

    const [row, setRow] = useState<any[]>([]);
    const [col, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    React.useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        const data = await fetch('https://jsonplaceholder.typicode.com/users')
        const referral = await data.json();
        handleCorrectData(referral);
    }

    const handleCorrectData = (referrals: any ) => {
        let mock = 0;
        const mapping = referrals.map((data: any) => {
            mock = mock + 1;
            return {
                id: data.id,
                referred_by: 'Mark Goodman',
                full_name: `${data.name} ${data.username}`,
                phone_number: '5555555555',
                email: data.email,
                linkedin_url: '#',
                cv_url: '#',
                tech_stacks: ['Typescript','Java','Python','React','Javascript','Scala','MySQL','Angular','QA'],
                ta_recruiter: 'John',
                referral_status_id: 'in progress',
            }
        });

        setRow(mapping);

        const progress = (params: any) => {
            switch (params.value) {
                case 'in progress':
                    params.value = 'primary';
                    break;
                case 'hired':
                    params.value = 'success';
                    break;
                case 'closed':
                    params.value = 'error';
                    break;
                default:
                    params.value = 'default';
                    break;
            }
            return params.value;
        }

        const columns = [
            { field: "referral_status_id", headerName: "Status", width: 108, renderCell: (params: any) => (
                <Chip label={params.value} size="small" variant="outlined" color={progress(params)} />
            ),},
            { field: "full_name", headerName: "Full Name", width: 230 },
            { field: "linkedin_url", headerName: "Linkedin", width: 74, renderCell: (params: any) => (
                <IconButton color="primary" component="span">
                    <Link to={params.value}>
                        <div className='icons'><LinkedIn/></div>
                    </Link>
                </IconButton>
                ),
            },
            { field: "cv_url", headerName: "CV", width: 30, renderCell: (params: any) => (
                    <IconButton color="primary" component="span">
                        <Link to={params.value}>
                            <div className='icons'><FileOpenOutlined/></div>
                        </Link>
                    </IconButton>
                ),
            },
            { field: "phone_number", headerName: "Phone", width: 100 },
            { field: "email", headerName: "Email", width: 254, renderCell: (params: any) => (
                    <div className='email-icon'>
                        <IconButton className='icons' color="primary" component="span">
                            <Link to={'#'+params.value} onClick={() => {navigator.clipboard.writeText(params.value)}}>
                                <EmailOutlined/>
                            </Link>
                        </IconButton>
                        {params.value}
                    </div>
                    
                ),
            },
            { field: "tech_stacks", headerName: "Tech Stacks", width: 294, renderCell: (params: any) => (
                <div className='tech_tag_container'>
                    {params.value.map((tech: string) => (<span className='tag'>{ tech }</span>))}
                </div>
                ),
            },
            { field: "referred_by", headerName: "Referred_by", width: 240 },
            { field: "ta_recruiter", headerName: "Ta Recruiter", width: 200 },
            { field: "id", headerName: "Actions", width: 90, renderCell: (params: any) => (
                    <Box sx={{ '& button': { m: 1 } }}>
                        <Stack direction={'row'} spacing={1}>
                            <IconButton color="primary" component="span">
                                <Link to={`/referrals/edit/${params.value}`}>
                                    <EditOutlined/>
                                </Link>
                            </IconButton>
                            <IconButton color="error" component="span">
                                <Link to={'#'}>
                                    <DeleteOutlined/>
                                </Link>
                            </IconButton>
                        </Stack>
                    </Box>
                ),
            },
        ];

        setColumns(columns);
        setLoading(false);
        }

    const myRow = row.map(( rows, index ) => ({
        internalId: index,
        id: rows.id,
        referred_by: rows.referred_by,
        full_name: rows.full_name,
        phone_number: rows.phone_number,
        email: rows.email,
        linkedin_url: rows.linkedin_url,
        cv_url: rows.cv_url,
        tech_stacks: rows.tech_stacks,
        ta_recruiter: rows.ta_recruiter,
        referral_status_id: rows.referral_status_id,
    }));
    
    return (
        <div style={{ height: 460, width: '100%' }}>
            <DataGrid
                rows={myRow}
                getRowId={(row) => row.internalId}
                columns={col}
                getRowHeight={ () => "auto" }
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20, 50]}
                loading={loading}
            />
        </div>
    );
}
