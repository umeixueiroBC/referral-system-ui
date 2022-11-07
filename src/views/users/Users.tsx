import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import {Box} from "@mui/material";
import './users.scss'
import { UsersDataGrid } from "../../components/user";

const Users = () => {
    return (
        <>
            <div className="main">
                <Divider>
                    <Chip label="USERS"></Chip>
                </Divider>
                <br></br>
                <Box height={'700px'}>
                    <UsersDataGrid/>
                </Box>
            </div>
        </>
    );
}
export default Users;
