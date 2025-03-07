import back from "../images/back2.jpg";
import { useNavigate } from "react-router-dom";

export default function Title() {
  const navigate = useNavigate();

  function towrite() {
    navigate("/createpost");
  }
  return (
    <div className="title">
      <img src={back} alt="" srcset="" />
      <div className="title-text">
        <h1>
          Welcome To <p>BlogSpot</p>
        </h1>
        <p className="title-para">
          Starts a journey with something innovative and explore the world.
        </p>
        <button className="getStarted-btn" onClick={towrite}>
          Write a Post
        </button>
      </div>
    </div>
  );
}
