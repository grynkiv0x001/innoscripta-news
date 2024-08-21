import Search from '@/assets/icons/search.svg';
import Menu from '@/assets/icons/menu-burger.svg';

import style from './header.module.scss';

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.header_logo}>
        <span>News</span>
        <span>Portal</span>
      </div>

      <div className={style.header_controls}>
        <Search />
        <Menu />
      </div>
    </header>
  );
};

export default Header;
