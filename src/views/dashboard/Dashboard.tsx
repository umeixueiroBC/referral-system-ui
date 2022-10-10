import React, {useEffect} from 'react';
import './Dashboard.scss';
import Navbar from "../../components/navbar/Navbar";
import switchDashboardRoutes from "../../routes";
import useLocalStorage from "../../components/storage/useLocalStorage";
import {useHistory} from "react-router-dom";

const Dashboard = () => {
    const [token, setToken] = useLocalStorage('token', '');
    const history = useHistory();

    useEffect(() => {
        if (token === '') {
            setToken('');
            history.replace('');
        }
    });

    return (
        <div className="App">
            <Navbar/>
            { switchDashboardRoutes }
        </div>
    );
}

export default Dashboard;
