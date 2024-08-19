import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchArticles, filterArticles } from '@/features/articles/articlesSlice';
import { AppDispatch, RootState } from '@/app/store';

const Articles: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const articles = useSelector((state: RootState) => state.articles.articles);

  console.log('articles:', articles);

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
      <select name="source">
        <option value="BBC">BCC</option>
        <option value="The New Your Times">The New York Times</option>
      </select>
      <div>
        {articleStatus === 'loading' && <p>Loading...</p>}
        {articleStatus === 'failed' && <p>Error: {error}</p>}
        {articleStatus === 'success' && (
          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                Source: {article.source}
                {article.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Articles;
