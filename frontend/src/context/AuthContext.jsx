import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { initializeSocket, disconnectSocket } from "../services/socket";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await authAPI.checkStatus();
            console.log('Auth status full response:', response.data);
            
            if (response.data.status && response.data.user) {
                const userInfo = {
                    _id: response.data.user._id,
                    username: response.data.user.username,
                    email: response.data.user.email
                };
                
                console.log('Setting user from checkAuthStatus:', userInfo);
                setUser(userInfo);
                setIsAuthenticated(true);
                
                if (userInfo._id) {
                    initializeSocket(userInfo._id);
                }
            } else {
                console.log('No user found in auth status');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            console.log('Full signup response:', response.data);
            
            if (response.data.success) {
                const userInfo = {
                    _id: response.data._id,
                    username: response.data.username,
                    email: response.data.email
                };
                
                console.log('Setting user:', userInfo);
                setUser(userInfo);
                setIsAuthenticated(true);
                
                initializeSocket(userInfo._id);
                return { success: true };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Signup failed' 
            };
        }
    };


    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            console.log('Full login response:', response.data);
            
            if (response.data.success) {
                const userInfo = {
                    _id: response.data._id,
                    username: response.data.username,
                    email: response.data.email
                };
                
                console.log('Setting user:', userInfo);
                setUser(userInfo);
                setIsAuthenticated(true);
                initializeSocket(userInfo._id);
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        disconnectSocket();
    };

    const value = {user, loading, isAuthenticated, signup, login, logout};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};