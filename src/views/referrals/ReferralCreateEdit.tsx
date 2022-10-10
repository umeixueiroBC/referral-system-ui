//Dependencies
import * as React from 'react';
import {
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import { ReferralForm } from "../../components/referral";
import {
    Chip,
    Divider,
    Grid,
    CircularProgress
} from "@mui/material";
import { useParams } from "react-router-dom";
import './referralCreateEdit.scss';
import { useFetchReferral } from "../../services/referralService";
import useLocalStorage from "../../components/storage/useLocalStorage";

const ReferralCreateEdit: FunctionComponent = () => {
    const [token] = useLocalStorage('token', '');
    const { id }: any = useParams();
    const { fetchReferral, isLoadingfetchReferral } = useFetchReferral();
    const [referralData, setReferralData] = useState<any>({});
    const [title, setTitle] = useState("CREATE A REFERRAL");

    useEffect(() => {
        if (id) {
            setTitle("EDIT A REFERRAL");
            fetchReferral({
                id,
                token
            }).then(response => {
                setReferralData(response);
            }).catch(e => {
                console.log(e);
            });
        }
    }, []);

    return (
        <div className="main">
            <Divider>
                <Chip label={ title }></Chip>
            </Divider>
            { isLoadingfetchReferral &&
                <Grid container spacing={ 2 } minHeight={ 60 } padding={ 10 }>
                    <Grid item md={ 12 }>
                        <CircularProgress color="primary"/>
                    </Grid>
                </Grid> }
            { (referralData.id || !id) &&
                <ReferralForm
                    data={ referralData }
                /> }
        </div>
    );
}

export default ReferralCreateEdit;
