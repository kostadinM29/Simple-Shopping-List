import React, { useState, useEffect } from 'react';
import useAuthenticatedAxios from '../hooks/useAuthenticatedAxios';

const Product = () =>
{
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState('');
    const [editProductId, setEditProductId] = useState(null);
    const [editProductName, setEditProductName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [editProductCategoryId, setEditProductCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const axiosInstance = useAuthenticatedAxios();

    const handleGetProducts = async () =>
    {
        try
        {
            const response = await axiosInstance.get('all-products');
            setProducts(response.data);
        } catch (error)
        {
            console.error('Error fetching products:', error);
        }
    };

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

    const handleAddProduct = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axiosInstance.post('add-product', { name: newProduct, categoryId: selectedCategoryId });
            setNewProduct('');
            setTimeout(() =>
            {
                handleGetProducts();
            }, 500);
        } catch (error)
        {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = async () =>
    {
        if (editProductId !== null && editProductName.trim() !== '')
        {
            try
            {
                await axiosInstance.put(`https://localhost:7146/api/edit-product/${editProductId}`, {
                    name: editProductName,
                    categoryId: editProductCategoryId,
                });
                setEditProductId(null);
                setEditProductName('');
                setEditProductCategoryId('');
                handleGetProducts();
            } catch (error)
            {
                console.error('Error editing product:', error);
            }
        }
    };

    const handleDeleteProduct = async (productId) =>
    {
        try
        {
            await axiosInstance.delete(`https://localhost:7146/api/delete-product/${productId}`);
            handleGetProducts();
        } catch (error)
        {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() =>
    {
        handleGetProducts();
        handleGetCategories();
    }, []);

    if (categories.length === 0)
    {
        return (
            <div className="container mx-auto mt-8">
                <h1>Please create a category first!</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Products</h2>

            <form onSubmit={handleAddProduct} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="New product"
                        value={newProduct}
                        onChange={(e) => setNewProduct(e.target.value)}
                        className="w-full p-2 border mr-2"
                    />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full p-2 border mr-2"
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Add
                    </button>
                </div>
            </form>

            <ul>
                {products.map((product, index) => (
                    <li key={product.id} className={`mb-2 p-2 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                        {editProductId === product.id ? (
                            <div className="flex">
                                <input
                                    type="text"
                                    value={editProductName}
                                    onChange={(e) => setEditProductName(e.target.value)}
                                    className="w-full p-2 border mr-2"
                                />
                                <select
                                    value={editProductCategoryId}
                                    onChange={(e) => setEditProductCategoryId(e.target.value)}
                                    className="w-full p-2 border mr-2"
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleEditProduct} className="bg-green-500 text-white p-2 rounded">
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span>{product.name}</span>
                                <div>
                                    <button
                                        onClick={() =>
                                        {
                                            setEditProductId(product.id);
                                            setEditProductName(product.name);
                                            setEditProductCategoryId(product.categoryId);
                                        }}
                                        className="bg-yellow-500 text-white p-2 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
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

export default Product;