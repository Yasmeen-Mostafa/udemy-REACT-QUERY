import { useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useQuery } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // const data = [];
  const {data,isFetching}=useQuery({
    queryKey:['posts',currentPage],
    queryFn:()=>fetchPosts(currentPage),
    refetchOnWindowFocus:false
  })
  if(!data) return <div></div>
  return (
    <>
    {isFetching?<h1>Loading...</h1>:<> <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage===1}  onClick={() => setCurrentPage(prev=>prev-1)}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage>=maxPostPage}  onClick={() => setCurrentPage(prev=>prev+1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}</>}
     
    </>
  );
}
