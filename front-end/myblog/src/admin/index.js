import { API_URL } from "../config"

export const createCategory = async (token, category)=> {
    try {
        const response = await fetch(`${API_URL}/create/category`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(category)
        });
        return response.json();
    }
    catch (err) {
        console.log(err);
    }
};

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/category`, {
            method: "GET",
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const deleteCategory = async (slug, token) => {
    try {
        const response = await fetch(`${API_URL}/category/${slug}`, {
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

