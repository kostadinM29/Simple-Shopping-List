import { useAuth } from "../hooks/useAuth";

const Home = () =>
{
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                {user ? (
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Welcome to your shopping list, {user.decodedToken.email}!</h1>
                    </div>
                ) : (
                    <h1 className="text-3xl font-bold">Please log in to start creating your shopping lists!</h1>
                )}
            </div>
        </div>
    );
};

export default Home;
