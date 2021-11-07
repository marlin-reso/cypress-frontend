import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../../redux/rootReducer';
import { setSearchQuery } from '../../browseSlice';

const CardNameSearch: React.FC = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.browse);

  const updateSearchQuery = (newSearchQuery: string) => {
    dispatch(setSearchQuery({ searchQuery: newSearchQuery }));
  };

  return (
    <StyledCardNameSearch fullWidth variant="outlined">
      <InputLabel htmlFor="search-query" className="input-label-fix">
        Card Name
      </InputLabel>
      <OutlinedInput
        id="search-query"
        value={searchQuery}
        placeholder="Search by card name"
        label="Card Name"
        onChange={(e) => updateSearchQuery(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon color="disabled" />
          </InputAdornment>
        }
      />
    </StyledCardNameSearch>
  );
};

const StyledCardNameSearch = styled(FormControl)(() => ({
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingBottom: '10px',
}));

export default CardNameSearch;
