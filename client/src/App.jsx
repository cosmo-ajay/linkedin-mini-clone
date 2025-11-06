import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import NavBar from "./components/NavBar";
import { getUser } from "./auth";
import api from "./api";

function App() {
  const [user, setUser] = useState(getUser());
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get("/posts").then((res) => setPosts(res.data));
  }, [user]);

  return (
    <div>
      <NavBar user={user} onLogout={() => setUser(null)} />

      {!user ? (
        <AuthForm onSuccess={() => setUser(getUser())} />
      ) : (
        <div style={styles.container}>
          <PostForm onPost={(p) => setPosts([...posts, p])} />
          <PostList posts={posts} setPosts={setPosts} user={user} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "800px",
    margin: "20px auto",
  },
};

export default App;  
