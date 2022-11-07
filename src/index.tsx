import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Login from "./views/login/Login";
import {Dashboard} from "./views/dashboard";
import SnackbarProvider from "./hooks/SnackBarProvider";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // Remove comments on StricMode once this is in prod mode
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
            <Router>
                <Switch>
                    <Route path="/referrals">
                        <Dashboard/>
                    </Route>
                    <Route path="/users">
                        <Dashboard/>
                    </Route>
                    <Route path="/" exact strict>
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </SnackbarProvider>
    </QueryClientProvider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
