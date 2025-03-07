import demo from "../../images/story2.jpg";
import "./Detailview.css";
import delicon from "../../icons/delete.png";
import editicon from "../../icons/edit.png";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getpostdetail, deletePost } from "../../../services/apiService";
import { DataContext } from "../../../context/Dataprovider";
import Comments from "./Comment";

export function Detailview() {
  const navigate = useNavigate();
  const { account } = useContext(DataContext);
  const { id } = useParams();
  const [data, setData] = useState({});
  const [tag, setTag] = useState("");

  useEffect(() => {
    const fetchDAta = async () => {
      let response = getpostdetail({ id });
      response.then((result) => {
        if (!result) {
          console.log("something wrong in fetcching post data");
        } else {
          // console.log(result.data.post);
          // setUrl(result.picture);
          setData(result.data.post);
          setTag(result.data.post.author[0].toUpperCase());
        }
      });
    };
    fetchDAta();
    // console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteblog = (e) => {
    console.log("delete click");
    let response = deletePost({ id });
    response.then((result) => {
      if (!result) {
        console.log("something wrong in fetching post data");
      } else {
        navigate("/");
      }
    });
  };

  // console.log(data);

  return (
    <div className="detailview-container">
      <div className="detailview-posotimage">
        <img src={data.picture} alt="" />
      </div>
      <div className="detailview-author">
        <div className="author">
          <div className="avatar">{tag}</div>
          {data.author}
        </div>
        <div className="detailview-icons-wrapper">
          {account.email === data.email && (
            <>
              <Link to={`/updatepost/${data._id}`}>
                <div className="detailview-icon">
                  <img src={editicon} alt="" />
                </div>
              </Link>
              <div
                onClick={(e) => {
                  deleteblog(e);
                }}
                className="detailview-icon"
              >
                <img src={delicon} alt="" />
              </div>
              <div className="delete-icon"></div>
            </>
          )}
        </div>
      </div>

      <h1 className="detailview-post-title">{data.title}</h1>
      <div className="postdate">
        {new Date(data.dop).toLocaleTimeString()} ,{" "}
        {new Date(data.dop).toDateString()}
      </div>
      <div className="post-description">{data.content}</div>
      <div>
        <Comments post={data} />
      </div>
    </div>
  );
  // return <div>this is data</div>;
}
