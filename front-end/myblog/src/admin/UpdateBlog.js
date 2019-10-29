import React, {useState, useEffect} from 'react';
import Menu from '../core/Menu';
import {isAuthenticated} from '../auth';
import {getCategories, editBlog} from '.';
import {FormText, Label, Button, Form, FormGroup, Input} from 'reactstrap';
import ReactQuill from 'react-quill';
import {singleBlog} from '../core'

const UpdateBlog = ({match}) => {

    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]); 
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',
        body: ''
    });

    const { error, success, formData, title } = values;

    const loadBlog = async (slug) => {
        try {
            const data = await singleBlog(slug);
            if(data.error) {
                return console.log(data.error)
            } else {
                setValues({...values, title: data.title, formData: new FormData() });
                setBody(data.body);
                return setCategoriesArray(data.categories);
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
        loadBlog(match.params.slug)
        setValues({...values, formData: new FormData()});
        init()
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
    };

    const setCategoriesArray = blogCategories => {
        let ca = [];
        blogCategories.map((c, i) => {
            return (ca.push(c._id))   
        });
        setChecked(ca);
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

    const findOutCategory = c => {
        const result = checked.indexOf(c);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const {token} = isAuthenticated();

    const update = async (e) => {
        e.preventDefault();
        const data = await editBlog(formData, token, match.params.slug);
        if (data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, title: data.title, success: `L'article "${data.title}" a bien été modifié` });
        }
    };
    
    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input
                        onChange={handleToggle(c._id)}
                        checked={findOutCategory(c._id)}
                        type="checkbox"
                        className="mr-2"
                    />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
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
            <Form className="" onSubmit={update} >
                <FormGroup>
                    <Input type="text" onChange={handleChange('title')} name="title" placeholder="Title" value={title} />
                </FormGroup>
                <FormGroup>
                    <ReactQuill onChange={handleBody} modules={UpdateBlog.modules} formats={UpdateBlog.formats} value={body} />
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

UpdateBlog.modules = {
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
 
UpdateBlog.formats = [
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


export default UpdateBlog;