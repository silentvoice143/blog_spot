import { useContext } from "react";
import { DataContext } from "../../../context/Dataprovider";
import { deleteComments } from "../../../services/apiService";

import "./Detailview.css";
import del from "../../icons/delete.png";

export default function UserComments({ comment, setToggle }) {
  const { account } = useContext(DataContext);

  function deletecomment(e) {
    let response = deleteComments(comment._id);
    response.then((result) => {
      setToggle((prevState) => !prevState);
    });
  }
  return (
    <div className="usercomment-wrapper">
      <div className="useridcomment">
        <h2>{comment.name}</h2>
        <div
          className="delicon"
          onClick={(e) => {
            deletecomment(e);
          }}
        >
          {account.email === comment.useremail && <img src={del} alt="" />}
        </div>
      </div>
      <div className="commentdate">{new Date(comment.date).toDateString()}</div>
      <div>{comment.comment}</div>
    </div>
  );
}
