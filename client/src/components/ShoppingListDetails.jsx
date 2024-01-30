import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useAuthenticatedAxios from '../hooks/useAuthenticatedAxios';

const ShoppingListDetails = () =>
{
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedList, setSelectedList] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCount, setSelectedCount] = useState(1);
    const axiosInstance = useAuthenticatedAxios();

    const handleGetShoppingListDetails = async () =>
    {
        try
        {
            const response = await axiosInstance.get(`one-shopping-list/${id}`);
            setSelectedList(response.data);
            setSelectedName(response.data.name);
            setSelectedDate(new Date(response.data.date));
        } catch (error)
        {
            console.error('Error fetching shopping list details:', error);
        }
    };

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

    const handleEditShoppingList = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axiosInstance.put(`edit-shopping-list/${id}`, {
                name: selectedName,
                date: selectedDate,
            });
            setEditMode(false);
            handleGetShoppingListDetails();
        } catch (error)
        {
            console.error('Error editing shopping list:', error);
        }
    };

    const handleEnterEditMode = () =>
    {
        setEditMode(true);
    };

    const handleCancelEditMode = () =>
    {
        setEditMode(false);
        setSelectedName(selectedList.name);
        setSelectedDate(new Date(selectedList.date));
    };

    const handleAddProductToShoppingList = async () =>
    {
        try
        {
            await axiosInstance.post(`add-product-to-shopping-list/${id}`, {
                productId: selectedProduct,
                count: selectedCount,
            });
            handleGetShoppingListDetails();
        } catch (error)
        {
            console.error('Error adding product to shopping list:', error);
        }
    };

    const handleDeleteShoppingList = async () =>
    {
        try
        {
            await axiosInstance.delete(`delete-shopping-list/${id}`);
            navigate('/');
        } catch (error)
        {
            console.error('Error deleting shopping list:', error);
        }
    };

    const handleToggleItemPurchased = async (shoppingListItemId) =>
    {
        try
        {
            await axiosInstance.put(`toggle-item-purchased/${id}/${shoppingListItemId}`);
            handleGetShoppingListDetails();
        } catch (error)
        {
            console.error('Error toggling item as purchased:', error);
        }
    };

    const handleRemoveProductFromShoppingList = async (shoppingListItemId) =>
    {
        try
        {
            await axiosInstance.delete(`remove-product-from-shopping-list/${id}/${shoppingListItemId}`);
            handleGetShoppingListDetails();
        } catch (error)
        {
            console.error('Error removing product from shopping list:', error);
        }
    };

    useEffect(() =>
    {
        handleGetShoppingListDetails();
        handleGetProducts();
    }, [id]);

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">
                Shopping List Details - {selectedList?.name}
            </h2>

            <form onSubmit={handleEditShoppingList} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Shopping list name"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="w-full p-2 border mr-2"
                        required
                        disabled={!editMode}
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="w-full p-2 border"
                        dateFormat="yyyy-MM-dd"
                        popperPlacement="top-start"
                        disabled={!editMode}
                    />
                    {!editMode && (
                        <>
                            <button
                                type="button"
                                onClick={handleEnterEditMode}
                                className="bg-yellow-500 text-white p-2 rounded ml-2"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteShoppingList}
                                className="bg-red-500 text-white p-2 rounded ml-2"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    {editMode && (
                        <>
                            <button
                                type="button"
                                onClick={handleCancelEditMode}
                                className="bg-gray-500 text-white p-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded ml-2"
                            >
                                Save
                            </button>
                        </>
                    )}
                </div>
            </form>

            <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Add Product to Shopping List</h3>
                <div className="flex">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full p-2 border mr-2"
                    >
                        <option value="" disabled>
                            Select a product
                        </option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={selectedCount}
                        onChange={(e) => setSelectedCount(parseInt(e.target.value))}
                        className="w-full p-2 border mr-2"
                        placeholder="Set a count"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleAddProductToShoppingList}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-2">Shopping List Items</h3>
                <ul>
                    {selectedList?.items.map((item) => (
                        <li key={item.id} className={`mb-2 p-2 border flex justify-between items-center border-b-2 ${item.purchased ? ' border-green-500' : 'border-red-300'}`}>
                            <div>
                                <span className="mr-4">{item.productName}</span>
                                <span className="mr-4">Count: {item.count}</span>
                                <span>{item.purchased ? 'Purchased' : 'Not Purchased'}</span>
                            </div>
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => handleToggleItemPurchased(item.id)}
                                    className="bg-gray-500 text-white p-2 rounded mx-1"
                                >
                                    Toggle Purchased
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProductFromShoppingList(item.id)}
                                    className="bg-red-500 text-white p-2 rounded mx-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
};

export default ShoppingListDetails;