import React, {useState, useEffect} from 'react';
import Menu from '../core/Menu';
import {isAuthenticated} from '../auth';
import {createBlog, getCategories} from '.';
import {FormText, Label, Button, Form, FormGroup, Input} from 'reactstrap';
import ReactQuill from 'react-quill'; // 

const AddBlog = () => {
    const retrieveBlog = () => {
        if (typeof window === 'undefined') {
            return false;
        }
        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return false;
        }
    };
    
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]); // categories
    const [body, setBody] = useState(retrieveBlog())
    const [values, setValues] = useState({
        error:'',
        sizeError:'',
        success:'',
        formData:'',
        title:'',
    })

    const {error, sizeError, success, formData, title} = values

    const init = async () => {
        try {
            const data = await getCategories()
            if(data.error) {
               return setValues({ ...values, error: data.error });
            } else {
                return setCategories(data)
            }
        }
        catch (err) {
            console.log(err);
        }       
    }

    useEffect(() => {
        init();
        setValues({...values, formData: new FormData()});
    // eslint-disable-next-line 
    }, []);

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    const handleToggle = c => () => {
        setValues({ ...values, error: '' });
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);
    };

    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const {token} = isAuthenticated();

    const publish = async (e) => {
        e.preventDefault();
        try {
            const data = await createBlog(formData, token); 
            if (data.error) {
                return setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, title: '', error: '', success: `Le nouvel article "${data.title}" a été ajouté` });
                setBody('');
            } 
        }
        catch (err) {
            return console.log(err);
        }
    };
       
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );

    const newBlogForm = () => ( 
        <div className="" >
            <Form className="" onSubmit={publish}>
                <FormGroup>
                    <Input type="text" onChange={handleChange('title')} name="title" placeholder="Title" value={capitalize(title)} />
                </FormGroup>
                <FormGroup>
                    <ReactQuill onChange={handleBody} modules={AddBlog.modules} formats={AddBlog.formats} value={body} />
                </FormGroup>
                <FormGroup>
                    <Label className="btn btn-outline-info">
                        Ajouter une image
                        <Input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                        <FormText>Taille maximum 1 Mo</FormText>
                    </Label>
                </FormGroup>
                <Button color="info">Publier</Button>
            </Form>
        </div>
    )
    
    return (
        <div>
            <Menu/>
            <h2 className="jumbotron">Ajouter un article</h2>
            {showError()}
            {showSuccess()}
            <div className = "row ml-2">
                <div className = "col-md-8" > 
                {newBlogForm()}
                </div>
                <div className = "col-md-4" > 
                <h3>Catégories</h3> 
                {showCategories()}
                </div>
            </div>
        </div>
    );
}

AddBlog.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block']
    ]
};
 
AddBlog.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
];


export default AddBlog;