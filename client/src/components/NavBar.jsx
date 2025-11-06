import { getUser, logout } from "../auth";

export default function NavBar() {
  const user = getUser();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>LinkedIn Mini</h2>

      {user ? (
        <div style={styles.right}>
          <span style={styles.user}>👤 {user.name}</span>
          <button onClick={logout} style={styles.btn}>Logout</button>
        </div>
      ) : null}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#0A66C2",
    color: "white",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontWeight: "bold",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  user: {
    fontSize: "15px",
  },
  btn: {
    background: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
