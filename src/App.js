import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Components/Post";
import ImageUpload from "./Components/ImageUpload";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  IconButton,
  Input,
  InputBase,
  Paper,
  Snackbar,
} from "@material-ui/core";
import {
  ExploreOutlined,
  FavoriteBorder,
  Send,
  Search,
} from "@material-ui/icons";
import Story from "./Components/Story";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 280,
    height: 33,
    border: "1px solid lightgray",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
}));

function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);

  const [posts, setPosts] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //! user has logged in
        setUser(authUser);
      } else {
        //! user has logged out
        setUser(null);
      }
    });

    return () => {
      //! cleanup
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
              <img
                className="app-header-img"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
              <img
                className="app-header-img"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app-header">
        <img
          className="app-header-img"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search Instagram"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
          >
            <Search />
          </IconButton>
        </Paper>

        {user ? (
          <div className="app-headerLeft">
            <Button onClick={() => auth.signOut()}> Log Out</Button>
            <Send />
            <ExploreOutlined />
            <FavoriteBorder />
            <Avatar
              className="app-headerAvatar"
              src={user.photoURL}
              alt={user.displayName}
            />
          </div>
        ) : (
          <div className="app-loginContainer">
            <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={() => setOpen(true)}> Sign Up </Button>
          </div>
        )}
      </div>

      <div className="app-posts">
        <Story />
        <div className="app-posts-left">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <Snackbar
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="info">
            Sign in to upload posts!
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default App;
