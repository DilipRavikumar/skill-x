import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
          const fetchedOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Assume 'thumbnail' field contains the URL to the image
            thumbnail: doc.data().thumbnail || "",
          }));
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [auth, firestore]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ fontSize: "1.75rem", marginLeft: "20px", marginBottom: "20px", color: "rgb(1, 11, 231)" }}>
        My Orders
      </h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              margin: "0 auto 20px auto",
              width: "80%",
              maxWidth: "600px",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            {/* Thumbnail Section */}
            {order.thumbnail && (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginRight: "20px",
                  backgroundColor: "#f0f0f0", // Placeholder background color for missing images
                }}
              >
                <img
                  src={order.thumbnail}
                  alt={`Thumbnail for order ${order.id}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}

            {/* Details Section */}
            <div style={{ flex: 1 }}>
              <h3>Order #{order.id}</h3>
              <p>Gig: {order.gigTitle}</p>
              <p>Status: {order.status}</p>
              <p>Price: ₹{order.price}</p>
              <p>
                Delivery Date:{" "}
                {new Date(order.deliveryDate.seconds * 1000).toLocaleDateString()}
              </p>
            </div>

            {/* Actions Section */}
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Placeholder for actions (like buttons) */}
            </div>
          </div>
        ))
      ) : (
        <p
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          No orders found.
        </p>
      )}
    </div>
  );
};

export default OrdersList;
