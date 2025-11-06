import { useState } from "react";
import api from "../api";
import dayjs from "dayjs";

export default function PostList({ posts, setPosts, user }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const isOwner = (p) => user && String(p.userId) === String(user.id);
  const likedByMe = (p) =>
    user && (p.likes || []).some((uid) => String(uid) === String(user.id));

  async function handleLike(id) {
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setPosts(data);
    } catch (e) {
      alert(e?.response?.data?.message || "Could not like post");
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setEditText(p.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(id) {
    try {
      const { data } = await api.put(`/posts/${id}`, { text: editText });
      setPosts(data);
      cancelEdit();
    } catch (e) {
      alert(e?.response?.data?.message || "Could not save edit");
    }
  }

  if (!posts?.length) {
    return (
      <p style={{ textAlign: "center", color: "gray", marginTop: 16 }}>
        No posts yet. Be the first to post!
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {posts.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 12,
            background: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>👤 {p.userName}</strong>
            <small style={{ color: "gray" }}>
              {dayjs(p.createdAt).format("DD MMM, hh:mm A")}
            </small>
          </div>

          <div style={{ marginTop: 8 }}>
            {editingId === p._id ? (
              <>
                <textarea
                  rows={3}
                  style={{ width: "100%" }}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => saveEdit(p._id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <p style={{ marginTop: 6 }}>{p.text}</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button onClick={() => handleLike(p._id)}>
              {likedByMe(p) ? "Unlike" : "Like"} ({p.likes?.length || 0})
            </button>

            {isOwner(p) && editingId !== p._id && (
              <button onClick={() => startEdit(p)}>Edit</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
