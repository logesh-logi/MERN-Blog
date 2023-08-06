import React, { useState } from "react";

function RegisterPage() {
  //
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(
      "https://mernblog-tdm1.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    if (response.status === 200) alert("Registeration Successfull");
    else alert("Registeration failed");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
    </>
  );
}

export default RegisterPage;
