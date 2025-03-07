import { Link } from "react-router-dom";
import { category_list } from "./category_list";
import "./Category.css";

export default function Category() {
  function createlist(data) {
    let name = data.name;
    name = name.toLowerCase();
    return (
      <Link to={`/?category=${name}`} className="category-item" key={data.id}>
        {data.name}
      </Link>
    );
  }
  return (
    <div className="category-wrapper">
      <h1 className="category-item">Categories</h1>
      {category_list.map(createlist)}
    </div>
  );
}
