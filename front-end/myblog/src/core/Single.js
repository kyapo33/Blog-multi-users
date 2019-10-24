import React, {useState, useEffect} from 'react'
import Menu from './Menu'
import {singleBlog} from '../core'
import moment from 'moment'
import parse from 'html-react-parser';
import { API_URL } from "../config"


const Single = ({match}) => {
    const [oneBlog, setOneBlog] = useState({})
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

    useEffect(() => {
        loadBlog(match.params.slug)
    }, [match.params.slug]);

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
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        {parse(`${oneBlog.body}`)}
                    </div>  
                </div>
            </div>
        </article>
        </div>   
    )
}
export default Single;