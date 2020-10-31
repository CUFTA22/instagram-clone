import { Avatar } from "@material-ui/core";
import React from "react";
import "./Story.css";
import FirestoreLogo from "../assets/firestore.png";

const Story = () => {
  return (
    <div className="story">
      <Avatar
        alt="Story"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
        className="story-avatar"
      />
      <Avatar
        alt="Story"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQQBa0iwnSjZaEZKfan1wPN3PneJc_I-R4sfw&usqp=CAU"
        className="story-avatar"
      />
      <Avatar
        alt="Story"
        src="https://material-ui.com/static/logo.png"
        className="story-avatar"
      />
      <Avatar
        alt="Story"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1024px-Visual_Studio_Code_1.35_icon.svg.png"
        className="story-avatar"
      />
      <Avatar alt="Story" src={FirestoreLogo} className="story-avatar" />
      <Avatar
        alt="Story"
        src="data:image/jpeg;base64,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"
        className="story-avatar"
      />
    </div>
  );
};

export default Story;
