import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostDetail from "./PostDetail";

const maxPostPage = 10;

const fetchPosts = async (pageNum) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
};

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // prefetches next page so transition is instant ie. no "Loading..."
  useEffect(() => {
    // don't fetch beyond what we know is there ie. only do the following logic if currentPage is less than maxPostPage
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  const { data, isLoading, isError, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    { staleTime: 2000, keepPreviousData: true }
  );
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong...</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
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
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
};

export default Posts;
