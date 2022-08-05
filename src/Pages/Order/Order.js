import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Order = () => {
    const [user] = useAuthState(auth);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const url = `https://secret-refuge-69927.herokuapp.com/order?email=${user?.email}`;
            try {
                const { data } = await axios.get(url, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setOrders(data);
            }
            catch (err) {
                if (err.response.status === 401 || err.response.status === 403) {
                    signOut(auth);
                    navigate('/login');
                }
            }
        }
        fetchData()
    }, [])
    return (
        <div>
            {
                orders.map(order => <div key={order._id}> {order.service}</div>)
            }
        </div>
    );
};

export default Order;