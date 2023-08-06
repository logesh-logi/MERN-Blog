import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Blogs({ _id, title, summary, content, cover, createdAt, author }) {
  return (
    <div className="blogs-entry">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img
            src={"https://mernblog-tdm1.onrender.com/uploads" + cover}
            alt="img"
          />
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="/" className="author">
            {author.username}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Blogs;
