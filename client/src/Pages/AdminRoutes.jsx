import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminRoute() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const token = cookies.get('TOKEN');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://elective-subject-selector-backend.onrender.com/yaae', {
                    withCredentials: true,
                });

                const { status, user } = response.data;
                if (status && user) {
                    setUser(user);
                } else {
                    navigate('/login'); // Redirect to login page or handle unauthorized access
                }
            } catch (error) {
                console.error(error);
                // Handle error - e.g., show error message or redirect to an error page
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (isLoading) {
        return <div>  Loading...</div>; // Show a loading state while checking user role
    } else {
        if (user && user.role === 'admin') {
            return <Outlet />;
        } else {
            return <div>You are not authorized to access this page</div>; // Handle unauthorized access
        }
    }
}
