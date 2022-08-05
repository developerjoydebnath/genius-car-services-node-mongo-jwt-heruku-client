import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import { toast, ToastContainer } from 'react-toastify';

const Checkout = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState({});
    const [user] = useAuthState(auth);
    console.log(serviceId)

    useEffect(() => {
        const fetchData = async () => {
            const url = `https://secret-refuge-69927.herokuapp.com/service/${serviceId}`;
            await axios.get(url)
                .then(response => {
                    const { data } = response;
                    setService(data);
                })
        }
        fetchData();
    }, []);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        const order = {
            email: user.email,
            service: service.name,
            serviceId: serviceId,
            address: e.target.address.value,
            phone: e.target.phone.value
        };
        console.log(order)
        const fetchData = async () => {
            await axios.post("https://secret-refuge-69927.herokuapp.com/order", order)
                .then(response => {
                    const { data } = response;
                    if (data.insertedId) {
                        toast('Your order is booked!!!');
                        e.target.reset();
                    }
                })
        }
        fetchData();
    }

    // const [user, setUser] = useState({
    //     name: 'Akbar The Great',
    //     email: 'akbar@momo.taj',
    //     address: 'Tajmohol Road Md.pur',
    //     phone: '01711111111'
    // });

    // const handleAddressChange = event =>{
    //     console.log(event.target.value);
    //     const {address, ...rest} = user;
    //     const newAddress = event.target.value;
    //     const newUser = {address: newAddress, ...rest};
    //     console.log(newUser);
    //     setUser(newUser);
    // }

    return (
        <div>
            <h2>Please Checkout your booking : {service?.name}</h2>
            <form onSubmit={handlePlaceOrder}>
                <input className='w-100 mb-2' type="text" value={user?.displayName} name="name" placeholder='name' required readOnly disabled />
                <br />
                <input className='w-100 mb-2' type="email" value={user?.email} name="email" placeholder='email' required readOnly disabled />
                <br />
                <input className='w-100 mb-2' type="text" value={service?.name} name="service" placeholder='service' required readOnly />
                <br />
                <input className='w-100 mb-2' type="text" name="address" placeholder='address' autoComplete='off' required />
                <br />
                <input className='w-100 mb-2' type="text" name="phone" placeholder='phone' required />
                <br />
                <input className='btn btn-primary' type="submit" value="Place Order" />
            </form>
            <ToastContainer />
        </div>
    );
};

export default Checkout;