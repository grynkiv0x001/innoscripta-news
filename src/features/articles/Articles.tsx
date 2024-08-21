import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchArticles, filterArticles } from '@/features/articles/articlesSlice';
import { AppDispatch, RootState } from '@/app/store';

import Article from '@/components/article/Article';

import style from './articles.module.scss';

const Articles: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const articles = useSelector((state: RootState) => state.articles.articles);

  console.log('articles:', articles);

  const articleStatus = useSelector(
    (state: RootState) => state.articles.status
  );
  const error = useSelector((state: RootState) => state.articles.error);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(filterArticles(e.target.value));
  };

  return (
    <div className={style.articles}>
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
              <Article key={index} article={article} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Articles;
