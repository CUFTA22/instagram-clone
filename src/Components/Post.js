import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";

const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post-header">
        <Avatar
          className="post-avatar"
          alt="Nikola"
          src="https://instagram.fbeg2-1.fna.fbcdn.net/v/t51.2885-19/s320x320/69026295_367827300579644_2553145684224114688_n.jpg?_nc_ht=instagram.fbeg2-1.fna.fbcdn.net&_nc_ohc=4mSQYKebUB4AX9JMBh4&oh=0463c5b20d666275fa2796ddd992b08a&oe=5F8A4F86"
        />
        <h3>{username}</h3>
      </div>
      <img className="post-image" src={imageUrl} alt="Post" />
      <h4 className="post-text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post-comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form>
          <input
            className="post-input"
            type="text"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post-button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
