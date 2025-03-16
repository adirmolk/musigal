import React, { useEffect, useState } from "react";
import Post from "./Post";
import ProductPost from "./ProductPost";
import SongPost from "./SongPost";
import eventBus from "../EventBus/eventBus";

const PostArea = ({ color }) => {
  const [postType, setPostType] = useState("song");

  const [togglePost, setTogglePost] = useState(false);
  const showPost = () => {
    setTogglePost(!togglePost);
  };
  useEffect(() => {
    const handleNewSong = () => {
      setTogglePost((x) => (x = !x));
    };

    eventBus.on("productPosted", handleNewSong);

    return () => {
      eventBus.off("productPosted", handleNewSong);
    };
  }, []);
  useEffect(() => {
    const handleNewSong = () => {
      setTogglePost((x) => (x = !x));
    };

    eventBus.on("songPosted", handleNewSong);

    return () => {
      eventBus.off("songPosted", handleNewSong);
    };
  }, []);
  return (
    <div style={{ marginTop: togglePost ? "0" : "25px" }} className="">
      <div style={{ display: togglePost ? "block" : "none" }}>
        <Post />
      </div>

      <div
        className="rounded  btn text-center ms-4"
        onClick={() => setPostType("song")}
        style={{
          display: togglePost ? "none" : "inline",
          backgroundColor:
            postType === "song" ?? !togglePost ? "lightblue" : "white",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/musicnote.png"}
          alt="Song 1"
          className=""
          style={{ marginBottom: "2px", width: "17px", height: "15px" }}
        />
        <span style={{ fontSize: "16px" }} className="m-2">
          Posts
        </span>
      </div>

      <div
        className="rounded btn text-center ms-2"
        onClick={() => setPostType("product")}
        style={{
          display: togglePost ? "none" : "inline",
          backgroundColor: postType === "product" ? "lightblue" : "white",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/item.png"}
          alt="Song 2"
          className="mb-1"
          style={{ width: "16px", height: "16px" }}
        />
        <span style={{ fontSize: "16px" }} className="m-2">
          Shop
        </span>
      </div>
      <div
        className="rounded btn text-center  "
        onClick={() => showPost()}
        style={{
          marginLeft: togglePost ? "25px" : "7px",
          height: "36px",
          border: "lightgray 1px solid",
          backgroundColor: togglePost === true ? "lightblue" : "#EEEDEF",
        }}
      >
        <span style={{ color: "gray" }} className="fw-bold ">
          +
        </span>
        <span style={{ fontSize: "14px" }} className="m-2">
          Upload
        </span>
      </div>
      {postType === "song" ? (
        <div>
          <SongPost color={color} />
        </div>
      ) : (
        <div>
          <ProductPost color={color} />
        </div>
      )}
    </div>
  );
};

export default PostArea;
