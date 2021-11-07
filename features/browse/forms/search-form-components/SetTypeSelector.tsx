import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import AutocompleteWithNegation from '../../../../components/AutocompleteWithNegation';
import { useGetSetTypesQuery } from '../../../../network/services/mtgcbApi';
import { setExpansionTypes, SetType } from '../../browseSlice';

const SetTypeSelector: React.FC = () => {
  const dispatch = useDispatch();

  const updateSetTypes = (newSetTypes: SetType[]) => {
    dispatch(setExpansionTypes({ setTypes: newSetTypes }));
  };

  const [selectedTypes, setSelectedTypes] = useState([]);

  const { data: setTypesResponse } = useGetSetTypesQuery();
  const setTypes = setTypesResponse?.data?.setTypes;
  const setTypesWithExclude = setTypes?.map((setType) => ({
    ...setType,
    exclude: false,
  }));

  return setTypes?.length ? (
    <StyledSetTypeSelector>
      <AutocompleteWithNegation
        label="Set Types"
        options={setTypesWithExclude}
        selectedOptions={selectedTypes}
        setSelectedOptionsLocally={setSelectedTypes}
        setSelectedOptionsRemotely={updateSetTypes}
      />
    </StyledSetTypeSelector>
  ) : null;
};

const StyledSetTypeSelector = styled.div(() => ({
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingBottom: '10px',
}));

export default SetTypeSelector;
