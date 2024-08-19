import Articles from '@/features/articles/Articles';
import Header from '@/components/header/Header';

import style from './app.module.scss';

const App = () => {
  return (
    <div className={style.app}>
      <Header />
      <Articles />
    </div>
  );
};

export default App;
