import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/UserDashboard'
import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './user/AdminDashboard'
import ManageCategory from './admin/ManageCategory'



const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path = "/" exact component= {Home}/>
                <Route path = "/signup" exact component= {Signup}/>
                <Route path = "/signin" exact component= {Signin}/>
                <PrivateRoute path = "/user/dashboard" exact component= {Dashboard}/>
                <AdminRoute path = "/admin/dashboard" exact component= {AdminDashboard}/>
                <AdminRoute path = "/manage/category" exact component= {ManageCategory}/>
            </Switch>
        </BrowserRouter>
    );     
    
};

export default Routes;