import Search from '@/assets/icons/search.svg?react';
import Menu from '@/assets/icons/menu-burger.svg?react';

import style from './header.module.scss';

const Header = () => {
  return (
    <header className={style.header}>
      Header

      <Search />
      <Menu />
    </header>
  );
};

export default Header;
