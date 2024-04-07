import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(
    () => {
      fetch("http://localhost:5500/profile", {
        credentials: "include",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((userInfo) => {
        userInfo.json().then((data) => {
          setUserInfo(data);
        });
      });
    }, // eslint-disable-next-line
    []
  );

  function logout() {
    fetch("http://localhost:5500/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    localStorage.removeItem("token");
  }

  const username = userInfo?.username;

  return (
    <main>
      <header>
        <Link to="/" className="logo">
          MyBlog
        </Link>
        <nav>
          {username && (
            <>
              <Link to="/create">create post</Link>
              <a href="/" onClick={logout}>
                logout
              </a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </main>
  );
}

export default Header;
