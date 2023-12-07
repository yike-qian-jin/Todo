import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { login } from "../features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_API = "http://localhost:3001";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerNewUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(BASE_API + "/newUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await response.json();
        dispatch(
          login({
            email: email,
          })
        );
      } else {
        console.error("error");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const logInUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(BASE_API + "/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await response.json();
        dispatch(
          login({
            email: email,
          })
        );
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoginContainer>
      <form onSubmit={logInUser}>
        <InputsContainer>
          <label htmlFor="email">Enter Your Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputsContainer>
        <InputsContainer>
          <label htmlFor="password">Enter Your Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
        </InputsContainer>
      </form>
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  margin: 200px auto;
  border-radius: 5px;
  background-color: var(--dark);
  max-width: 500px;
  padding: 20px;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  input {
    outline: none;
    border: none;
    padding: 8px;
    border-radius: 5px;
  }
  button {
    cursor: pointer;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    margin-top: 20px;
  }
`;
