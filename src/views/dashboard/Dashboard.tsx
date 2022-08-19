import React from 'react';
import './Dashboard.scss';
import Navbar from "../../components/navbar/Navbar";
import switchDashboardRoutes from "../../routes";

const Dashboard = () => {
    return (
        <div className="App">
            <Navbar/>
            {switchDashboardRoutes}
        </div>
    );
}

export default Dashboard;
