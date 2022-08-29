//Dependencies
import React from "react";
import CreateButton from "../../components/button/Button";
import ApexTable from "../../components/table/table";
import './index.scss'

import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const MyReferral = () => {
    return (
        <>
            <div className="main">
                <Divider>
                    <Chip label="MY REFERRALS"></Chip>
                </Divider>
                <br></br>
                <CreateButton/>
                <ApexTable/>
            </div>
        </>
    );
}
export default MyReferral;
