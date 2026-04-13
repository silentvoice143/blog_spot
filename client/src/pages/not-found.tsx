import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center px-4">

            <h1 className="text-6xl font-bold text-gray-900">404</h1>

            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                Page not found
            </h2>

            <p className="mt-2 text-gray-500 max-w-md">
                The page you are looking for doesn’t exist or has been moved.
            </p>

            <Link
                to="/"
                className="mt-6 px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
                Go back home
            </Link>
        </div>
    );
};

export default NotFound;