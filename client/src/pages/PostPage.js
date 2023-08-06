import { formatISO9075 } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import EditIcon from "@mui/icons-material/Edit";

function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`https://mernblog-tdm1.onrender.com/post/${id}`).then((response) => {
      response.json().then((data) => {
        setPostInfo(data);
      });
    });
  }, []);

  if (!postInfo) return "";

  return (
    <>
      <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">by {postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <EditIcon />
              Edit this post
            </Link>
          </div>
        )}
        <div className="image">
          <img
            src={`https://mernblog-tdm1.onrender.com/${postInfo.cover}`}
            alt=""
          />
        </div>
        <div className="content">
          <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
      </div>
    </>
  );
}

export default PostPage;
