import { VFC } from 'react';
import { SearchMap } from '../components/Search/SearchMap';
import EntdeckenMap from '../components/EntdeckenMap';
import PageWrapper from '../components/PageUtils/PageWrapper';

const Entdecken: VFC = () => {
  return (
    <PageWrapper showIonHeader={false}>
      <SearchMap />
      <EntdeckenMap />
    </PageWrapper>
  );
};

export default Entdecken;
