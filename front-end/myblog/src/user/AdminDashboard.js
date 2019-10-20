import React from 'react';
import Menu from '../core/Menu';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom'

const AdminDashboard = () => {
    const {user: {
            name, 
            email,
            role
        }} = isAuthenticated();
    
    const AdminLinks = () => {
        return (
            <div className = "card">
                <h4 className ="card-header">Administration</h4>
                <ul className = "list-group">
                    <Link className = "nav-link" to="/manage/category">Gérer les catégories</Link>
                    <Link className = "nav-link" to="/create/product">Ajouter un produit</Link>
                    <Link className = "nav-link" to="/manage/product">Gérer les produits</Link>
                    <Link className = "nav-link" to="/admin/orders">Commandes clients</Link>
                </ul>     
            </div>
        )    
    };

    const AdminInfo = () => {
        return (
            <div className = "card mb-5">
                <h3 className = "card-header">Mes Informations</h3> 
                <ul className = "list-group">
                    <li className = "list-group-item">{name}</li>
                    <li className = "list-group-item">{email}</li>
                    <li className = "list-group-item">{role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>     
            </div>
        )
    };

    return ( 
        <div>
            <Menu/>
            <h2 className="jumbotron">Bienvenue {name}</h2>
            <div className = "row">
                <div className = "col-3" >
                    {AdminLinks()}
                </div>
                <div className = "col-9" >
                    {AdminInfo()} 
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;