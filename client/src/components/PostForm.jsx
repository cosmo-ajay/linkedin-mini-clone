import { useState } from "react";
import api from "../api";
import { getUser } from "../auth";

export default function PostForm({ onPost }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const user = getUser(); // ✅ get logged in user

    try {
      const payload = {
        text,
        userId: user._id, // ✅ required by backend
        userName: user.name,
      };

      const res = await api.post("/posts", payload);
      setText("");
      onPost(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating post");
    }
  };

  return (
    <div style={styles.box}>
      <form onSubmit={submit} style={styles.form}>
        <textarea
          placeholder="Write something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
      {msg && <p style={styles.error}>{msg}</p>}
    </div>
  );
}

const styles = {
  box: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "18px",
    background: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  error: { color: "red" },
};
