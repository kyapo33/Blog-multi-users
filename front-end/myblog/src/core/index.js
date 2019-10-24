import { API_URL } from "../config"

export const listBlogsCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/blogs-categories`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
            },
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const singleBlog = async (slug) => {
    try {
        const response = await fetch(`${API_URL}/blog/${slug}`, {
            method: "GET",
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const getBlogsByCategory = async (slug, sortBy) => {
    try {
        const response = await fetch(`${API_URL}/categories/${slug}?sortBy=${sortBy}&order=desc`, {
            method: "GET",
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
}

export const getRelatedBlogs = async (blogId, sortBy) => {
    try {
        const response = await fetch(`${API_URL}/blog/related/${blogId}?sortBy=${sortBy}&order=desc`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        });
        return response.json();   
    }
    catch (err) {
        return console.log(err);
    }
}
