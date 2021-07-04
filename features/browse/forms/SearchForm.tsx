import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import {
  CardNameSearch,
  OracleTextSearch,
  TypeSelector,
  SetSelector,
  ColorSelector,
  ShowAllPrintingsToggle,
  CardStatSearch,
  SortSelector,
} from './search-form-components';

const SearchForm: React.FC = () => {
  const { isFormVisible } = useSelector((state: RootState) => state.browse);

  return (
    <>
      {isFormVisible && (
        <>
          <CardNameSearch />
          <OracleTextSearch />
          <TypeSelector />
          <ColorSelector />
          <SetSelector />
          <CardStatSearch />
          <SortSelector />
          <ShowAllPrintingsToggle />
        </>
      )}
    </>
  );
};

export default SearchForm;
