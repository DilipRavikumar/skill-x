// OrdersList.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const OrdersContainer = styled.div`
  margin-top: 20px;
`;

const OrderItem = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(firestore, "orders"),
            where("freelancerId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [auth, firestore]);

  return (
    <OrdersContainer>
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <OrderItem key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Gig: {order.gigTitle}</p>
            <p>Status: {order.status}</p>
            <p>Price: ₹{order.price}</p>
            <p>Delivery Date: {new Date(order.deliveryDate.seconds * 1000).toLocaleDateString()}</p>
          </OrderItem>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </OrdersContainer>
  );
};

export default OrdersList;
