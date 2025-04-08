import CardPost from "@/components/posts/cardPost";
import { DataContext } from "@/context/Dataprovider";
import { useLoader } from "@/context/LoaderProvider";
import { getAllUserPost } from "@/services/apiService";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Stories() {
  const { account } = useContext(DataContext);
  const [postData, setPostData] = useState([]);
  const { setLoading } = useLoader();
  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await getAllUserPost(account.id);
      if (response.status === 200) {
        setPostData(response.data.posts);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const formatdate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    getPostData();
  }, []);
  return (
    <div className="px-8 pt-8 flex-1 flex justify-center">
      <div className="grid grid-cols-3 gap-x-6 gap-y-3 pr-16 pl-7">
        {postData.map((data, idx) => (
          <div key={`foryoupost ${idx}`}>
            <Link to={`/post/${data._id}`}>
              <CardPost
                key={data._id}
                title={data.title}
                content={data.description}
                dop={formatdate(new Date(data.createdAt))}
                email={data.email}
                picture={data.picture}
                author={data.author.name}
                tags={data.tags.join(",")}
                id={data._id}
                comments={data.comments.length}
              />
            </Link>
            <div className="h-[1px] bg-gray-secondary3 w-1/2 m-auto mt-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stories;
