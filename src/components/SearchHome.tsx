import { VFC } from 'react';
import Search from './Search';
import ListFilter from './ListFilter';

const SearchHome: VFC = () => {
  return (
    <div className='container-content container-content--search-home'>
      <Search showSuggestions={false} />
      <ListFilter />
    </div>
  );
};

export default SearchHome;
