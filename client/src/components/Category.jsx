import React, { useState, useEffect } from 'react';

import useAuthenticatedAxios from '../hooks/useAuthenticatedAxios';

const Category = () =>
{
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const axiosInstance = useAuthenticatedAxios();

    const handleGetCategories = async () =>
    {
        try
        {
            const response = await axiosInstance.get('all-categories');
            setCategories(response.data);
        } catch (error)
        {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axiosInstance.post('add-category', { name: newCategory });
            setNewCategory('');
            handleGetCategories();
        } catch (error)
        {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async () =>
    {
        if (editCategoryId !== null && editCategoryName.trim() !== '')
        {
            try
            {
                await axiosInstance.put(`https://localhost:7146/api/edit-category/${editCategoryId}`, {
                    name: editCategoryName,
                });
                setEditCategoryId(null);
                setEditCategoryName('');
                handleGetCategories();
            } catch (error)
            {
                console.error('Error editing category:', error);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) =>
    {
        try
        {
            await axiosInstance.delete(`https://localhost:7146/api/delete-category/${categoryId}`);
            handleGetCategories();
        } catch (error)
        {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() =>
    {
        handleGetCategories();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <p className='mb-2 text-red-500'>
                *Please keep in mind that when you delete a category all products using that category will also be deleted.
            </p>
            <form onSubmit={handleAddCategory} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="New category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2 border mr-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Add
                    </button>
                </div>
            </form>

            <ul>
                {categories.map((category) => (
                    <li key={category.id} className="mb-2 p-2 border">
                        {editCategoryId === category.id ? (
                            <div className="flex">
                                <input
                                    type="text"
                                    value={editCategoryName}
                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                    className="w-full p-2 border mr-2"
                                />
                                <button onClick={handleEditCategory} className="bg-green-500 text-white p-2 rounded">
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span>{category.name}</span>
                                <div>
                                    <button
                                        onClick={() =>
                                        {
                                            setEditCategoryId(category.id);
                                            setEditCategoryName(category.name);
                                        }}
                                        className="bg-yellow-500 text-white p-2 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="bg-red-500 text-white p-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
