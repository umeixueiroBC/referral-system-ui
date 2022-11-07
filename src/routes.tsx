import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import { NotFound } from "./views/not-found";
import { ReferralCreateEdit, Referrals } from "./views/referrals";
import { Users } from './views/users';

const switchDashboardRoutes = (
    <Switch>
        <Route exact path="/users" component={ Users } />
        <Route strict exact path="/referrals" component={ Referrals }/>
        <Route strict exact path="/referrals/create" component={ ReferralCreateEdit }/>
        <Route strict exact path="/referrals/edit/:id" component={ ReferralCreateEdit }/>
        <Route path="*" component={ NotFound }/>
    </Switch>
);

export default switchDashboardRoutes;
