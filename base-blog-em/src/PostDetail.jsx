import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  // replace with useQuery
  // const data = [];
  const {data,isError,error,isLoading} =useQuery({
    queryKey:['comments',post.id],
    queryFn:()=>fetchComments(post.id),
    refetchOnWindowFocus:false
  })
  return (
    isError? <h1>{error}</h1>:isLoading?<h1>Loading ... </h1>:<><h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}</>
  );
}
