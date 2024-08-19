import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, filterArticles } from '@/features/articles/articlesSlice';

import { AppDispatch, RootState } from '@/app/store'; // Import RootState type

const Articles: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Type the state in useSelector using RootState
  const articles = useSelector((state: RootState) => state.articles.articles);
  const articleStatus = useSelector(
    (state: RootState) => state.articles.status
  );
  const error = useSelector((state: RootState) => state.articles.error);

  useEffect(() => {
    if (articleStatus === 'idle') {
      dispatch(fetchArticles());
    }
  }, [articleStatus, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(filterArticles(e.target.value));
  };

  return (
    <div>
      <input type="text" placeholder="Search articles" onChange={handleSearch} />
      <div>
        {articleStatus === 'loading' && <p>Loading...</p>}
        {articleStatus === 'failed' && <p>Error: {error}</p>}
        {articleStatus === 'success' && (
          <ul>
            {articles.map((article, index) => (
              <li key={index}>{article.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Articles;
