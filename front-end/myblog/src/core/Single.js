import React, {useState, useEffect} from 'react'
import Menu from './Menu'
import {singleBlog} from '../core'
import moment from 'moment'
import parse from 'html-react-parser';
import { API_URL } from "../config"
import {getRelatedBlogs} from '../core'
import {Link} from "react-router-dom"

const Single = ({match}) => {
    const [oneBlog, setOneBlog] = useState({})
    const [related, setRelated] = useState([])

     // eslint-disable-next-line
     const [error, setError] = useState(false)

    const loadBlog = async (slug) => {
        try {
            const data = await singleBlog(slug);
            if(data.error) {
                return setError(data.error)
            } else {
                return setOneBlog({title : data.title, slug: data.slug, body: data.body, user: data.postedBy.name, date: data.createdAt})
            }
        }
        catch (err) {
            console.log(err);
        }   
    }

    const loadRelated = async (blogId) => {
        try {
            const data = await getRelatedBlogs(blogId, 'createdAt')
            if(data.error) {
               return setError(data.error)
            } else {
                return setRelated(data)
            }
        }
        catch (err) {
            console.log(err);
        }   
    }

    const showRelated = () => {
        return related && related.map((r, i) => ( 
                <ul key={i}>
                    <Link to={`/blogs/${r.slug}/${r._id}`}><li>{r.title}</li></Link>
                </ul>
            )
        ) 
    } 

    useEffect(() => {
        loadRelated(match.params.blogId)
        loadBlog(match.params.slug)
    }, [match.params.slug, match.params.blogId]);

    return (
        <div className="">
        <Menu/>
        <header className="masthead" style={{backgroundImage:  `url(${API_URL}/blog/photo/${oneBlog.slug})`}}>
        <div className="container">
            <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="post-heading">
                            <h1>{oneBlog.title}</h1>
                            <p className="post-meta">Posté par {oneBlog.user} {moment(oneBlog.date).fromNow()}</p>  
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <article>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8 col-md-8 mx-auto">
                        {parse(`${oneBlog.body}`)}
                    </div>  
                    <div className="col-lg-4 col-md-4 mx-auto related">
                        <h3 className="mb-4">Dans la même catégorie</h3>
                        {showRelated()}
                    </div> 
                </div>
            </div>
        </article>
        </div>   
    )
}
export default Single;