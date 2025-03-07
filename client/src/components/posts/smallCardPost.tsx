import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

function SmallCardPost() {
  return (
    <Link to={"#"}>
      <Card className="p-0 border-none shadow-none outline-none w-fit max-w-[400px]">
        <CardContent className="p-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 text-xs bg-green-300 rounded-full">
              SV
            </div>
            <p className="text-sm font-light text-gray-secondary2">
              In Generative Ai by Author
            </p>
          </div>
          <div className="flex gap-3 mt-3">
            <div>
              <h1 className="text-2xl font-bold font-montserrat">
                Generative AI
              </h1>
              <p
                className={`text-base text-wrap font-light text-gray-secondary1 truncate ...`}
              >
                This is the latest blog about the ai crusial ...
              </p>
              <div className="flex justify-end gap-4">
                <div className="text-sm">1 Jan</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default SmallCardPost;
