import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetFilteredCardsSummaryLegacyQuery } from '../../network/services/mtgcbApi';
import { RootState } from '../../redux/rootReducer';
import useDebounce, { searchFieldDebounceTimeMs } from '../../util/useDebounce';
import CardTable from '../browse/CardTable';

interface ConnectedConnectionCardTableProps {
  userId: string;
  setId: string;
  first: number;
  skip: number;
  page: number;
  setSkip: (skip: number) => void;
  setFirst: (first: number) => void;
  setPage: (page: number) => void;
  goToOptions?: { label: string; value: string }[];
}

export const ConnectedCollectionCardTable: React.FC<ConnectedConnectionCardTableProps> = ({
  userId,
  setId,
  first,
  skip,
  page,
  setSkip,
  setFirst,
  setPage,
  goToOptions,
}) => {
  const {
    sortBy,
    sortByDirection,
    priceType,
    searchQuery,
    oracleTextQuery,
    artistQuery,
    cardRarities,
    cardTypes,
    cardColors,
    showAllPrintings,
    cardStatSearches,
  } = useSelector((state: RootState) => state.setCollection);

  const debouncedSearchQuery = useDebounce(searchQuery, searchFieldDebounceTimeMs);
  const debouncedOracleTextQuery = useDebounce(oracleTextQuery, searchFieldDebounceTimeMs);
  const debouncedArtistQuery = useDebounce(artistQuery, searchFieldDebounceTimeMs);
  const [previousTotalResults, setPreviousTotalResults] = useState(null);

  const { data: filteredCardsSummary, isLoading: loadingFilteredCardsSummary, isFetching } = useGetFilteredCardsSummaryLegacyQuery({
    userId,
    setId,
    first,
    skip,
    sortBy,
    sortByDirection,
    name: debouncedSearchQuery,
    oracleTextQuery: debouncedOracleTextQuery,
    artistQuery: debouncedArtistQuery,
    cardSets: [
      {
        category: 'Sets',
        value: setId,
        label: setId,
        exclude: false,
      },
    ],
    cardRarities,
    cardTypes,
    cardColors,
    showAllPrintings,
    cardStatSearches,
    additionalWhere: null,
    additionalSortBy: null,
  });

  const cards = filteredCardsSummary?.data?.filteredCardsSummaryLegacy?.cards;
  const totalResults = filteredCardsSummary?.data?.filteredCardsSummaryLegacy?.count;

  useEffect(() => {
    if (totalResults !== previousTotalResults) {
      setSkip(0);
      setPage(1);
      setPreviousTotalResults(totalResults);
    }
    if (skip > totalResults) {
      setSkip(0);
      setPage(1);
    }
  }, [skip, totalResults, previousTotalResults]);

  const collectionByCardId = useMemo(
    () =>
      filteredCardsSummary?.data?.filteredCardsSummaryLegacy?.cards?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as any),
    [filteredCardsSummary?.data?.filteredCardsSummaryLegacy?.cards]
  ); // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <MemoizedCollectionCardTable
      cards={cards}
      totalResults={totalResults}
      first={first}
      skip={skip}
      page={page}
      setSkip={setSkip}
      setFirst={setFirst}
      setPage={setPage}
      priceType={priceType}
      userId={userId}
      collectionByCardId={collectionByCardId}
      isFetching={isFetching}
      isLoading={loadingFilteredCardsSummary}
      goToOptions={goToOptions}
    />
  );
};

const MemoizedCollectionCardTable = memo(CardTable);
