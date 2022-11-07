import { ReferralDataGrid } from "../../components/referral";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import './referrals.scss'
import useLocalStorage from "../../components/storage/useLocalStorage";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";

const Referrals = () => {
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();

    useEffect(() => {
        if (token === '') {
            setToken('');
            history.replace('');
        }
    }, []);

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
                        endIcon={ <AddIcon/> }
                        onClick={ () => {
                            window.location.href = '/referrals/create'
                        } }>
                        Create Referral
                    </Button>
                </div>
                <Box height={'500px'}>
                    <ReferralDataGrid/>
                </Box>
            </div>
        </>
    );
}
export default Referrals;
