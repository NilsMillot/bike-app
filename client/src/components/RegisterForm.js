import React, { useState } from "react";

const RegisterForm = () => {
  // Set up state variables to store the email and password values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = event => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Use the Firebase `createUserWithEmailAndPassword` method to create a new user
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        // The user was created successfully
        // You can now save the user's data to your database
      })
      .catch(error => {
        // There was an error creating the user
        // You can handle the error here
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default RegisterForm;
