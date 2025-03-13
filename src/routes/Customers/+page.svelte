<script>
	import { handleSubmit } from '$lib/data_access.js';
  
	let name = "";
	let phone = "";
	let email = "";
	let vehicleModel = "";
	let error = "";
	let successMessage = "";
  
	function setError(message) {
	  error = message;
	}
  
	function setSuccessMessage(message) {
	  successMessage = message;
	}
  
	async function submitForm() {
	  await handleSubmit({ name, phone, email, vehicleModel, setError, setSuccessMessage });
	}
  </script>
  
  <style>
	form {
	  max-width: 400px;
	  margin: auto;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
	}
	input {
	  width: 100%;
	  padding: 8px;
	  margin: 5px 0;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	}
	button {
	  background-color: #28a745;
	  color: white;
	  padding: 10px;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	}
	button:hover {
	  background-color: #218838;
	}
	.error {
	  color: red;
	}
	.success {
	  color: green;
	}
  </style>
  
  <form on:submit|preventDefault={submitForm}>
	<h2>Customer Registration</h2>
  
	{#if error}
	  <p class="error">{error}</p>
	{/if}
  
	{#if successMessage}
	  <p class="success">{successMessage}</p>
	{/if}
  
	<label>Name:</label>
	<input type="text" bind:value={name} placeholder="Enter your name" required />
  
	<label>Phone:</label>
	<input type="text" bind:value={phone} placeholder="Enter your phone number" required />
  
	<label>Email:</label>
	<input type="email" bind:value={email} placeholder="Enter your email" required />
  
	<label>Vehicle Model:</label>
	<input type="text" bind:value={vehicleModel} placeholder="Enter your vehicle model" required />
  
	<button type="submit">Register</button>
  </form>
  