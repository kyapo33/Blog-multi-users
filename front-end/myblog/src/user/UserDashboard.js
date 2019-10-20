import React, { useState, useEffect } from 'react';
import Menu from '../core/Menu';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [showUserInfo, setShowUserInfo] = useState(false); 

    const { user: { _id, name, email } } = isAuthenticated();

    const userLinks = () => {
        return (
            <div className = "card card-links mb-3">
                <h4 className="card-header">Bonjour, {name}</h4>
                <ul className = "list-group">
                    <li className="list-group-item links">
                        <Link className="nav-link" style={{color: "#2ac1b7"}}  to="/user/dashboard">
                            Mes informations
                        </Link>
                    </li> 
                    <li className="list-group-item links">
                        <Link className="nav-link" style={{color: "#2ac1b7"}} to={`/profile/update/${_id}`}>
                            Editer  mon profil
                        </Link>
                    </li>  
                    <li className="list-group-item links">
                        <Link className="nav-link" style={{color: "#2ac1b7"}} to="/cart">
                            Mon panier
                        </Link>
                    </li>                
                </ul>     
            </div> 
        )
    };

    const userInfo = () => {
        return (
            <div className="card card-info mb-3">
                <table className="table table-hover ">
                    <tbody>
                        <tr>
                            <td><h4>Mes Informations</h4></td>
                            <td><p onClick={() => setShowUserInfo(!showUserInfo)} className="btn btn-sm button-details btn-info">Details</p> </td>
                        </tr> 
                    </tbody>
                </table>    
                {showUserInfo && <ul className="list-group">
                    <li className="list-group-item">Nom : {name}</li>
                    <li className="list-group-item">Adresse e-mail : {email}</li>
                </ul>}
            </div>
        )
    };

    return (
        <div>
            <Menu />
            <div className="userinterface">
                <div className="row">
                    <div className="col-lg-3">
                        {userLinks()}
                    </div>
                    <div className="col-lg-9" >
                        {userInfo()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;