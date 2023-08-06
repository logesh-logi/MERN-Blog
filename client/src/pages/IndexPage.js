import React, { useEffect, useState } from "react";
import Blogs from "../Blogs";

function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://mernblog-tdm1.onrender.com/post").then((response) => {
      response.json().then((data) => {
        setPosts(data);
      });
    });
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => {
          return <Blogs {...post} />;
        })}
    </>
  );
}

export default IndexPage;
