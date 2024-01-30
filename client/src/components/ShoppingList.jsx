import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import useAuthenticatedAxios from '../hooks/useAuthenticatedAxios';

const ShoppingList = () =>
{
    const [shoppingLists, setShoppingLists] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const axiosInstance = useAuthenticatedAxios();

    const handleGetShoppingLists = async () =>
    {
        try
        {
            const response = await axiosInstance.get('all-shopping-lists');
            setShoppingLists(response.data);
        } catch (error)
        {
            console.error('Error fetching shopping lists:', error);
        }
    };

    const handleCreateShoppingList = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axiosInstance.post('add-shopping-list', {
                name: selectedName,
                date: selectedDate,
            });
            setSelectedName('');
            setSelectedDate(new Date());
            handleGetShoppingLists();
        } catch (error)
        {
            console.error('Error creating shopping list:', error);
        }
    };

    useEffect(() =>
    {
        handleGetShoppingLists();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Shopping Lists</h2>

            <form onSubmit={handleCreateShoppingList} className="mb-4">
                <div className="flex mb-1">
                    <input
                        type="text"
                        placeholder="New shopping list name"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="w-full p-2 border mr-2"
                        required
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="w-full p-2 border"
                        dateFormat="yyyy-MM-dd"
                        popperPlacement="top-start"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
                        Add
                    </button>
                </div>
            </form>

            <ul>
                {shoppingLists.length > 0 && shoppingLists.map((list) => (
                    <li key={list.id} className="mb-2 p-2 border ">
                        <div className="flex justify-between items-center">
                            <span>{list.name} - {list.items.length} products.</span>
                            <span>{new Date(list.date).toLocaleDateString()}</span>
                            <Link to={`/shopping-lists/${list.id}`}>
                                <button className="bg-green-500 text-white p-2 rounded ml-2">
                                    Details
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;