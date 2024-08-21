import { IArticle } from 'src/types';

import style from './article.module.scss';

type ArticleProps = {
  article: IArticle;
  fullwidth?: boolean;
};

const Article = ({ article, fullwidth }: ArticleProps) => {
  const { title, urlToImage, source, publishedAt } = article;

  console.log('Article: ', article);

  return (
    <div
      className={`${style.article} ${fullwidth ? style.article__full : ''}`}
    >
      <img src={urlToImage} alt="Article Thumbnail" />
      <h3>{title}</h3>

      <div className={style.article_details}>
        <span>{publishedAt}</span>
        <span>{source}</span>
      </div>
    </div>
  );
};

export default Article;
