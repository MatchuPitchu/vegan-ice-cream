import { VFC } from 'react';
import Search from './Search';
import EntdeckenList from './EntdeckenList';
import ListFilters from './ListFilters';

const SearchHome: VFC = () => {
  return (
    <div className='container-content container-content--search-home'>
      <Search showSuggestions={false} />
      <ListFilters />
      <EntdeckenList />
    </div>
  );
};

export default SearchHome;
