import React, {useState, useEffect} from 'react'
import Menu from './Menu'
import banner from '../img/home-bg.jpg';
import {listBlogsCategories} from '../core'
import {getCategories} from '../admin';
import {Link} from "react-router-dom"
import moment from 'moment'
import parse from 'html-react-parser';
import { API_URL } from "../config"

const Home = () => {
    const [blogs, setBlogs] = useState('')
    const [categories, setCategories] = useState('')

    // eslint-disable-next-line
    const [error, setError] = useState(false)

    const loadBlogs = async () => {
        try {
            const data = await listBlogsCategories('createdAt'); 
            if(data.error) {
                return setError(data.error)
            } else {
                return setBlogs(data.blogs, data.categories, data.size)
            }
        }
        catch (err) {
            console.log(err);
        }  
    }

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
        loadBlogs()
        init()
    // eslint-disable-next-line
    }, []);

    const showBlogs = () => {
        return ( 
            blogs && blogs.map((blog, i) => {
                return ( 
                    <div className="row" key={i}>
                        <div className="col-lg-8 col-md-10 mx-auto">
                            <div className="post-preview">
                                <img alt={blog.title} className="img img-fluid" style={{maxHeight: '150px', width:'auto'}} src={`${API_URL}/blog/photo/${blog.slug}`}/>
                                <h2 className="post-title">
                                 <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                                </h2>
                                <h3 className="post-subtitle">
                                    {parse(`${blog.excerpt}`)}
                                <p className="categorie">Catégories : {blog.categories.map((c, i) => (
                                    <Link key={i} to={`/categories/${c.slug}`} className="mr-1 ml-1">
                                        {c.name}
                                    </Link>    
                                ))}</p>
                                </h3>
                            <p className="post-meta">Posté par {blog.postedBy.name} {moment(blog.createdAt).fromNow()}</p>
                            </div>
                            <hr></hr>
                        </div>   
                    </div> 
                )
            })
        )
    }

    const showCategories = () => {
        return categories && categories.map((c, i) => (
            <ul key={i} className="lastpost">
                <li > 
                    <Link  to={`/categories/${c.slug}`}>
                        {c.name}
                    </Link>  
                </li>   
            </ul>
        ))
    }

    const showLastPosts = () => {
        return blogs && blogs.map((blog, i) => (
            <ul key={i} className="lastpost">
                <li > 
                    <Link  to={`/blogs/${blog.slug}`}>
                        {blog.title}
                    </Link>  
                </li>   
            </ul>
        ))    
    }

    return (
        <div className="">
        <Menu/>
        <header className="masthead" style={{backgroundImage: `url(${banner})`}}>  
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="site-heading">
                            <h1>Music Blog</h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 aside">
                    {showBlogs()}
                </div>
                <div className="col-md-4 bloglist">
                    <h3 className="titleaside">Catégories</h3>
                    {showCategories()}
                </div>
            </div>    
        </div>
        <hr></hr>
        </div>
         
    )
}

export default Home;