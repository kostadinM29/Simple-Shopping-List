import { useAuth } from "../hooks/useAuth";

const Home = () =>
{
    const { user, logout } = useAuth();

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.username}!</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default Home;