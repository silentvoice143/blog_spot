import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import add from "../../icons/add.png";
import banner from "../../images/story2.jpg";
import "../write/CreatePost.css";
import { DataContext } from "../../../context/Dataprovider";
import {
  getpostdetail,
  uploadFile,
  updatePost,
} from "../../../services/apiService";
import { category_list } from "../../home/category_list";

const initialPost = {
  title: "",
  author: "",
  dop: new Date(),
  picture: banner,
  content: "",
  email: "",
  category: "",
};

export default function Update() {
  function createOptions(category) {
    let category_name = category.name;
    return (
      <option value={category_name} key={category.id}>
        {category_name}
      </option>
    );
  }

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(""); // you can manage data with it
  const { id } = useParams();

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [currentValue]);

  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState("");
  // const [imgurl, setImgurl] = useState("");

  const { account } = useContext(DataContext);
  const [url, setUrl] = useState(post.picture ? post.picture : banner);
  const [cat, setCat] = useState(post.category ? post.category : "");
  //
  //
  //
  //
  useEffect(() => {
    const fetchDAta = async () => {
      let response = getpostdetail({ id });
      response.then((result) => {
        if (!result) {
          console.log("something wrong in fetching post data");
        } else {
          // console.log(result.data.post);
          // setUrl(result.picture);
          setPost(result.data.post);
          setCat(result.data.post.category);
          setUrl(result.data.post.picture);
        }
      });
    };
    fetchDAta();
    // console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  //
  //
  //
  //this fuunction to upload image in the database
  const getImage = () => {
    if (file) {
      const data = new FormData();
      data.append("name", file.name);
      data.append("file", file);

      const response = uploadFile(data);
      if (response) {
        console.log(`Image uploaded successfully`);
        response.then((result) => {
          // console.log(result.data.imgURL);
          // setImgurl(result.data.imgURL);
          setUrl(result.data.imgURL);
          post.picture = result.data.imgURL;
        });
      }
      // console.log(response.resolve(data));
    }
  };
  useEffect(() => {
    getImage();
    //API CALL
    ///we will get url from mongodb
    post.author = account.name;
    post.email = account.email;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  //
  //
  //
  //
  //
  //
  //
  //

  function handleChange(e) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  function updatepost(e) {
    e.preventDefault();
    console.log("updating post");
    const response = updatePost(post, { id });
    console.log(response);
    if (response) {
      console.log(response.data);
      navigate(`/details/${id}`);
    }
  }

  return (
    <div className="write-container-wrapper">
      <div className="write-container">
        <div className="write-post-banner">
          <img src={url} alt="" srcSet="" />
        </div>
        <div className="post-title-container">
          <label htmlFor="postImage" className="addimg">
            <img src={add} alt="" srcset="" />
          </label>
          <input
            style={{ display: "none" }}
            type="file"
            name=""
            id="postImage"
            file={file}
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={post.title}
            onChange={handleChange}
          />
          <button
            onClick={(e) => {
              console.log("updating post");
              updatepost(e);
            }}
            className="publish-btn"
          >
            Update
          </button>
        </div>
        <div className="category-selection">
          <label htmlFor="programmingLanguages">Choose Your Category :</label>
          <div class="text-container">
            <input
              name="category"
              onChange={(e) => {
                setCat(e.target.value);
                setPost({
                  ...post,
                  [e.target.name]: e.target.value.toLocaleLowerCase(),
                });
              }}
              value={post.category}
              type="text"
              list="category"
              placeholder="Enter Here"
              autoComplete="off"
            />
            <datalist id="category">
              {/* <option value="Objective C">Objective C</option>
              <option value="C++">C++</option>
              <option value="C#">C#</option>
              <option value="Cobol">Cobol</option>
              <option value="Go">Go</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="Pascal">Pascal</option>
              <option value="Perl">Perl</option>
              <option value="R">R</option>
              <option value="Swift">Swift</option> */}
              {category_list.map(createOptions)}
            </datalist>
          </div>
        </div>
        <textarea
          name="content"
          placeholder="Tell your story ......"
          ref={textareaRef}
          value={post.content}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            handleChange(e);
          }}
        />
      </div>
    </div>
  );
}
