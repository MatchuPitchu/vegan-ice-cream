import { VFC } from 'react';
import Search from './Search';
import EntdeckenList from './EntdeckenList';
import ListFilters from './ListFilters';

const SearchHome: VFC = () => {
  return (
    <div className='container-content'>
      <Search showSuggestions={false} />
      <ListFilters />
      <EntdeckenList />
    </div>
  );
};

export default SearchHome;
