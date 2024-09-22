import React, { useState } from "react";

const EscrowComponent = () => {
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState(null);
  
  const gigId = "SEO";
  const amount = 400;
  const gigImage = "https://firebasestorage.googleapis.com/v0/b/skillx-a741e.appspot.com/o/gigs%2FFFiGQbDPgHcZqh7onNb3BZNj8L13%2Fimages.jpeg?alt=media&token=bfb3ead4-b8d0-45ff-a374-ed56eb1f0837";
  const freelancerName = "Dilip";

  const handleStartTask = () => {
    setStatus("Funds Deposited");
    setError(null);
    alert("Funds deposited successfully.");
  };

  const handleFreelancerComplete = () => {
    setStatus("Work Completed by Freelancer");
    alert("Task marked as completed.");
  };

  const handleEmployerVerification = () => {
    if (status !== "Work Completed by Freelancer") {
      setError("Freelancer hasn't completed the work yet.");
      alert("Freelancer hasn't completed the work yet.");
      return;
    }

    setStatus("Funds Released to Freelancer");
    alert("Funds released to freelancer.");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Escrow Management</h1>
      <p style={styles.status}>Escrow Status: {status}</p>
      {error && <p style={styles.error}>{error}</p>}
      
      <img
        src={gigImage}
        alt="Gig Image"
        style={styles.image}
      />

      <div style={styles.details}>
        <p style={styles.detail}>Gig: {gigId}</p>
        <p style={styles.detail}>Amount: ${amount}</p>
        <p style={styles.detail}>Freelancer: {freelancerName}</p>
      </div>
      
      <div style={styles.buttonContainer}>
        {status === "Pending" && (
          <button style={styles.button} onClick={handleStartTask}>
            Deposit Funds
          </button>
        )}
        {status === "Funds Deposited" && (
          <button style={styles.button} onClick={handleFreelancerComplete}>
            Mark Task as Completed
          </button>
        )}
        {status === "Work Completed by Freelancer" && (
          <button style={styles.button} onClick={handleEmployerVerification}>
            Verify and Release Funds
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "auto",
    marginTop: "40px",
  },
  heading: {
    marginBottom: "20px",
    color: "#007bff",
  },
  status: {
    fontSize: "18px",
    color: "#007bff",
  },
  error: {
    color: "red",
  },
  image: {
    borderRadius: "8px",
    width: "100%",
    height: "auto",
    marginBottom: "20px",
  },
  details: {
    width: "100%",
    marginBottom: "20px",
  },
  detail: {
    fontSize: "16px",
    color: "#495057",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default EscrowComponent;
