import { useState } from "react";
import api from "../api";
import { saveAuth } from "../auth";

export default function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(url, form);
      saveAuth(res.data);
      onSuccess();
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      <form onSubmit={submit} style={styles.form}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={update}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={update}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={update}
          required
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      {msg && <p style={styles.error}>{msg}</p>}

      <p>
        {isLogin ? "New user?" : "Already have an account?"}{" "}
        <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create account" : "Login here"}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "320px",
    margin: "90px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
  },
  error: { color: "red", marginTop: "8px" },
  link: { color: "#0A66C2", cursor: "pointer", fontWeight: "bold" },
};
