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
import AddBlog from './admin/AddBlog'
import Single from './core/Single'
import Categories from './core/Categories'
import ManageBlog from './admin/ManageBlog'
import UpdateBlog from './admin/UpdateBlog'

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
                <AdminRoute path = "/create/blog" exact component= {AddBlog}/>
                <AdminRoute path = "/manage/blogs" exact component= {ManageBlog}/>
                <AdminRoute path = "/edit/blog/:slug" exact component= {UpdateBlog}/>
                <Route path = "/blogs/:slug/:blogId" exact component= {Single}/>
                <Route path = "/categories/:slug" exact component= {Categories}/>
            </Switch>
        </BrowserRouter>
    );     
    
};

export default Routes;