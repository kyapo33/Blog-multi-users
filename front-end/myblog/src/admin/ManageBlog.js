import React, {useState, useEffect} from 'react';
import Menu from '../core/Menu';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import {listBlogsCategories} from '../core'
import {deleteBlogs} from '../admin'
import moment from 'moment'

const ManageBlog = () => {

    const [blogs, setBlogs] = useState([])

    const {token} = isAuthenticated()

    const loadBlogs = async () => {
        try {
            const data = await listBlogsCategories();
            if(data.error) {
                console.log(data.error)
            } else {
                setBlogs(data.blogs, data.categories)
            }
        }
        catch (err) {
            console.log(err);
        }     
    }

    const destroy = async (slug) => {
        try {
            const data = await deleteBlogs(slug, token);
            if(data.error) {
                console.log(data.error)
            } else {
                loadBlogs()
            }
        }
        catch (err) {
            console.log(err);
        }     
    }

    useEffect(() => {
        loadBlogs()
    }, [])

    const deleteConfirm = slug => {
        let answer = window.confirm('voulez vous supprimer ce blog ?');
        if (answer) {
            destroy(slug);
        }
    };

    return (
        <div>
            <Menu/>
            <h2 className="jumbotron">Gérer les Articles</h2>
            <div className="row">
                <div className="col-12">
                    <ul className="list-group">
                        {blogs.map((b,i) => (
                            <li key={i} className="list-group-item d-flex justify-content-center align-items-center">
                                <strong>{b.title}</strong><p className="post-meta">Posté par {b.postedBy.name} {moment(b.createdAt).fromNow()}</p>
                                <Link to={`/edit/blog/${b.slug}`}>
                                    <span className="badge-warning badge-pill badge">Mettre à jour</span>
                                </Link>
                                <span onClick={() => deleteConfirm(b.slug)} className="badge-danger badge-pill badge">Supprimer</span>
                            </li>
                        ))}
                    </ul>   
                </div>
            </div>
        </div>
    );
}

export default ManageBlog;