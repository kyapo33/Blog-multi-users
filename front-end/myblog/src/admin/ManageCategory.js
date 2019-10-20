import React, {useState, useEffect} from 'react';
import Menu from '../core/Menu';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import {createCategory, getCategories, deleteCategory} from '../admin'

const ManageCategory = () => {
    const [name, setName] = useState('') 
    const [error, setError] = useState(false)   
    const [success, setSuccess] = useState(false)  
    const [categories, setCategories] = useState([])
    
    const {token} = isAuthenticated()

    const handleChange = (e) => {
        setError('')
        setName(e.target.value)
    };

    const clickSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        try {
            const data = await createCategory(token, {name}) 
            if(data.error) {
                return setError(data.error)
            } else {
                setName('')
                setError("");
                setSuccess(true);  
                return init()  
            }
        }
        catch (err) {
            console.log(err);
        }  
    };

    const init = async () => {
        try {
            const data = await getCategories()
            if(data.error) {
               return setError(data.error)
            } else {
                return setCategories(data)
            }
        }
        catch (err) {
            console.log(err);
        }       
    }

    useEffect(() => {
        init()
    }, []);

    const destroy = async (slug) => {
        try {
            const data = await deleteCategory(slug, token);
            if(data.error) {
                console.log(data.error)
            } else {
               return init()
            }
        }
        catch (err) {
            console.log(err);
        }     
    }

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="text-muted">
                <label className="text-muted">Nom</label>
                <input type="text" className="form-control" 
                    onChange={handleChange}
                    value={name}
                    autoFocus/>
            </div>
            <button className="btn btn-success">Crée une catégory</button>
        </form>
    );

    const showSuccess = () => {
        if(success) {
            return <h3 className="text-success">La catégorie {name} a été crée</h3>
        }
    };

    const showError = () => {
        if(error) {
            return <h3 className="text-danger">La création de la catégorie a échoué</h3>
        }
    };

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-success">Revenir à l'administation</Link>
        </div>
    )
    return (
        <div>
            <Menu/>
            <h2 className="jumbotron">Créer une catégorie</h2>
            <div className = "row">
                <div className = "col-md-8 offset-md-2" >
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}
                    {categories.map((c,i) => (
                        <li key={i} className="list-group-item d-flex justify-content-center align-items-center">
                            <strong>{c.name}</strong>
                            <span onClick={() => destroy(c.slug)} className="badge-danger badge-pill badge">Supprimer</span>
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ManageCategory;