import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const Navigation = () =>
{
    const { user, logout } = useAuth();

    const getNavLinkClassName = (isActive) =>
    (
        isActive
            ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
            : 'block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
    );

    return (
        <nav className='bg-white border-gray-200'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <Link to='/' className='flex items-center space-x-3'>
                    <div className='text-4xl font-bold '>
                        <span className='text-teal-gray'>Shopping List</span>
                    </div>
                </Link>
                <div className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'>
                    <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white'>
                        <li>
                            <NavLink
                                to='/'
                                className={({ isActive }) => getNavLinkClassName(isActive)}
                            >Home</NavLink>
                        </li>
                        {user
                            ?
                            <>
                                <li>
                                    <NavLink
                                        to='/categories'
                                        className={({ isActive }) => getNavLinkClassName(isActive)}
                                    >Categories</NavLink>
                                </li>
                                <li>
                                    <h2> | Hello, {user.decodedToken.email}</h2>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        type='button'
                                        className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0'
                                    >Logout</button>
                                </li>
                            </>
                            :
                            <>
                                <li>
                                    <NavLink
                                        to={'/register'}
                                        className={({ isActive }) => getNavLinkClassName(isActive)}
                                    >Register</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={'/login'}
                                        className={({ isActive }) => getNavLinkClassName(isActive)}
                                    >Login</NavLink>
                                </li>
                            </>}
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default Navigation;