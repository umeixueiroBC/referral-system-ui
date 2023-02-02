import { ReferralDataGrid } from "../../components/referral";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import './referrals.scss'
import useLocalStorage from "../../components/storage/useLocalStorage";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchAllRecruiters } from "../../services/recruitersService";
import { useSnackbar } from "../../hooks/SnackBarProvider";

const Referrals = () => {
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();
    const { fetchAllRecruiters } = useFetchAllRecruiters();
    const snackbar = useSnackbar();
    const [recruitersList, setRecruitersList] = useState<any>([]);

    useEffect(() => {
        if (token === '') {
            setToken('');
            history.replace('');
        }

        handleFetchRecruiters();
    }, []);

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

    return (
        <>
            <div className="main">
                <Divider>
                    <Chip label="MY REFERRALS"></Chip>
                </Divider>
                <div className='create-referral-button '>
                    <Button
                        type='submit'
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={() => {
                            history.push('/referrals/create');
                        }}>
                        Create Referral
                    </Button>
                </div>
                <Box height={'500px'}>
                    {recruitersList.length > 0 && <ReferralDataGrid recruitersList={recruitersList} />}
                </Box>
            </div>
        </>
    );
}
export default Referrals;
