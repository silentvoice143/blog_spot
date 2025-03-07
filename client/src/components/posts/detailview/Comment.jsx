import person from "../../icons/user.png";
import "./Detailview.css";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../context/Dataprovider";
import { addComment, getComments } from "../../../services/apiService";
import UserComments from "./Comments";

export default function Comments({ post }) {
  const [commentList, setcommentList] = useState([]);
  const initialvalue = {
    name: "",
    useremail: "",
    postId: "",
    comment: "",
    date: new Date(),
  };

  const { account } = useContext(DataContext);

  const [comment, setComment] = useState(initialvalue);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchComments = () => {
      let id = {
        id: post._id,
      };
      // console.log(id);
      let response = getComments(id);
      response.then((result) => {
        // console.log(result.data);
        setcommentList(result.data);
      });
    };
    fetchComments();
  }, [toggle, post]);

  function handlechange(e) {
    setComment({
      ...comment,
      name: account.name,
      useremail: account.email,
      postId: post._id,
      comment: e.target.value,
    });
  }

  function addcomment(e) {
    e.preventDefault();
    let response = addComment(comment);
    response.then((result) => {
      if (result) {
        setComment(initialvalue);
        setToggle((prevState) => !prevState);
      }
    });
  }
  return (
    <div className="comment-wrapper">
      <div className="comment-box-container">
        <img src={person} alt="" srcset="" />
        <textarea
          className="comment-write"
          name="comment"
          id=""
          value={comment.comment}
          onChange={(e) => {
            handlechange(e);
          }}
        ></textarea>
        <button
          onClick={(e) => {
            addcomment(e);
          }}
          className="submit-comment"
        >
          Post
        </button>
      </div>
      <hr />
      <div className="comments-container">
        <h1>Comments:</h1>
        {commentList &&
          commentList.length > 0 &&
          commentList.map((com) => (
            <UserComments comment={com} setToggle={setToggle} />
          ))}
      </div>
    </div>
  );
}
