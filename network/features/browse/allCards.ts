import { api } from '../../index';
import { allCards as allCardsQuery } from '../../queries';
import buildBrowseFilter from './buildBrowseFilter';
import { SearchOptions } from './commonTypes';
import determineDistinctClause from './determineDistinctClause';

interface GetAllCardsFunction {
  (searchOptions: SearchOptions): any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const getAllCards: GetAllCardsFunction = async (searchOptions) => {
  const {
    first,
    skip,
    sortBy,
    name,
    oracleTextQuery,
    cardSets,
    cardRarities,
    cardTypes,
    cardColors,
    showAllPrintings,
    cardStatSearches,
  } = searchOptions;

  const where = buildBrowseFilter({ cardSets, cardRarities, cardTypes, cardColors, oracleTextQuery, cardStatSearches });
  const distinct = determineDistinctClause(showAllPrintings, sortBy);

  try {
    const response = await api.post('', {
      query: allCardsQuery,
      variables: {
        first,
        skip,
        sortBy,
        name,
        where,
        distinct,
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export default getAllCards;
