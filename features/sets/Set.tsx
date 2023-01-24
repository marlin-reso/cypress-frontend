import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Element } from 'react-scroll';
import styled from 'styled-components';
import { ResponsiveContainer } from '../../components/layout/ResponsiveContainer';
import { useGetAllCardsMetaQuery, useGetAllCardsQuery, useGetAllSubsetsQuery, useGetSetBySlugQuery } from '../../network/services/mtgcbApi';
import { RootState } from '../../redux/rootReducer';
import CardGallery from '../browse/CardGallery';
import CardTable from '../browse/CardTable';
import titleCase from '../browse/util/titleCase';
import { setFormVisibility } from './setSlice';
import { Subset } from './Subset';

interface SetProps {
  setSlug: string;
}

export const Set: React.FC<SetProps> = ({ setSlug }) => {
  const {
    searchQuery,
    oracleTextQuery,
    artistQuery,
    cardTypes,
    cardRarities,
    cardColors,
    showAllPrintings,
    cardStatSearches,
    sortBy,
    sortByDirection,
    viewSubject,
    viewMode,
    priceType,
  } = useSelector((state: RootState) => state.set);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFormVisibility({ isFormVisibile: true }));
    return function cleanUpForm() {
      dispatch(setFormVisibility({ isFormVisibile: false }));
    };
  }, []);

  const [skip, setSkip] = useState(0);
  const [first, setFirst] = useState(50);
  const [page, setPage] = useState(1);
  const [previousTotalResults, setPreviousTotalResults] = useState(null);

  const { data: setData, isLoading: isSetLoading, isFetching: isSetFetching, error: setError } = useGetSetBySlugQuery({ slug: setSlug });

  const { data: cardData, isLoading: isCardDataLoading, isFetching: isCardDataFetching, error: cardError } = useGetAllCardsQuery({
    first,
    skip,
    sortBy,
    name: searchQuery,
    oracleTextQuery,
    artistQuery,
    cardSets: [
      {
        category: 'Sets',
        value: setData?.data?.sets?.[0]?.id,
        label: setData?.data?.sets?.[0]?.name,
        exclude: false,
      },
    ],
    cardRarities,
    cardTypes,
    cardColors,
    showAllPrintings,
    cardStatSearches,
    sortByDirection,
  });

  const {
    data: cardMetaData,
    isLoading: isCardMetaDataLoading,
    isFetching: isCardMetaDataFetching,
    error: cardMetaError,
  } = useGetAllCardsMetaQuery({
    sortBy,
    name: searchQuery,
    oracleTextQuery,
    artistQuery,
    cardSets: [
      {
        category: 'Sets',
        value: setData?.data?.sets?.[0]?.id,
        label: setData?.data?.sets?.[0]?.name,
        exclude: false,
      },
    ],
    cardRarities,
    cardTypes,
    cardColors,
    showAllPrintings,
    cardStatSearches,
    sortByDirection,
  });

  const set = setData?.data?.sets?.[0];
  const cards = cardData?.data?.cards;
  const totalResults = cardMetaData?.data?.count;

  const { data: subsetData, isLoading: isSubsetLoading, isFetching: isSubsetFetching, error: subsetError } = useGetAllSubsetsQuery(
    {
      parentSetId: setData?.data?.sets?.[0]?.id,
    },
    {
      skip: !setData?.data?.sets?.[0]?.id,
    }
  );

  const subsets = subsetData?.data?.sets;
  let goToOptions = [];
  if (subsets?.length > 0) {
    goToOptions = [
      {
        label: set.name,
        value: set.slug,
      },
    ];

    goToOptions = goToOptions.concat(
      subsets.map((subset) => ({
        label: subset.name,
        value: subset.slug,
      }))
    );
  }

  const isLoading = isSetLoading || isCardDataLoading || isCardMetaDataLoading;
  const isFetching = isSetFetching || isCardDataFetching || isCardMetaDataFetching;

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

  // TODO: Make a nice set icon component with intelligent fallbacks or a default option
  // TODO: Add buy links here and come up with a good interface, similar to how Scryfall does card pages perhaps
  // TODO: Add charts/analysis/something cool here

  let setLabel = 'Set';
  if (set?.isSubsetGroup) {
    setLabel = 'Subset Group';
  } else if (set?.parentSetId != null) {
    setLabel = 'Subset';
  }

  return (
    <ResponsiveContainer maxWidth="xl" id="set-container">
      <div>
        {set && (
          <div>
            {(isLoading || setSlug !== setData?.data?.sets?.[0].slug) && (
              <CenteredSkeleton variant="rect" width="100%">
                <div style={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div">
                    {set?.name}
                  </Typography>
                  <i
                    className={`ss ss-${set.code.toLowerCase()} ss-5x ss-common ss-fw`}
                    style={{
                      // WebkitTextStroke: '1px #fff', // TODO: Use this style for a complete set so I can support ss-mythic ss-grad
                      textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                      paddingBottom: '5px',
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" component="div">
                    {set.releasedAt?.slice(0, 10)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    {set.cardCount ? `${set.cardCount} cards` : ''}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    {set.category} {setLabel}
                    {set.setType ? ` - ${titleCase(set.setType)}` : ''}
                  </Typography>
                </div>
              </CenteredSkeleton>
            )}
            {!isLoading && (
              <div style={{ textAlign: 'center' }}>
                <Element name={`anchor-link-${set?.slug}`} />
                <Typography variant="h4" component="div" id={`anchor-link-${set?.slug}`}>
                  {set?.name}
                </Typography>
                <i
                  className={`ss ss-${set.code.toLowerCase()} ss-5x ss-common ss-fw`}
                  style={{
                    // WebkitTextStroke: '1px #fff', // TODO: Use this style for a complete set so I can support ss-mythic ss-grad
                    textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                    paddingBottom: '5px',
                  }}
                />
                <Typography variant="body2" color="textSecondary" component="div">
                  {set.releasedAt?.slice(0, 10)}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="div">
                  {set.cardCount ? `${set.cardCount} cards` : ''}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="div">
                  {set.category} {setLabel}
                  {set.setType ? ` - ${titleCase(set.setType)}` : ''}
                </Typography>
              </div>
            )}
            {viewSubject === 'cards' && viewMode === 'grid' && (
              <MemoizedCardGallery
                cards={cards}
                totalResults={totalResults}
                first={first}
                skip={skip}
                page={page}
                setSkip={setSkip}
                setFirst={setFirst}
                setPage={setPage}
                priceType={priceType}
                isLoading={isLoading}
                isFetching={isFetching}
                goToOptions={goToOptions}
              />
            )}
            {viewSubject === 'cards' && viewMode === 'grid' && subsets?.length > 0 && (
              <>
                {subsets.map((subset) => (
                  <div key={`subset-grid-${subset.id}`}>
                    <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                    <Subset key={subset.id} setSlug={subset.slug} />
                  </div>
                ))}
              </>
            )}
            {viewSubject === 'cards' && viewMode === 'table' && (
              <MemoizedCardTable
                cards={cards}
                totalResults={totalResults}
                first={first}
                skip={skip}
                page={page}
                setSkip={setSkip}
                setFirst={setFirst}
                setPage={setPage}
                priceType={priceType}
                isShowingSingleSet
                isFetching={isFetching}
                isLoading={isLoading}
                goToOptions={goToOptions}
              />
            )}
            {viewSubject === 'cards' && viewMode === 'table' && subsets?.length > 0 && (
              <>
                {subsets.map((subset) => (
                  <div key={`subset-table-${subset.id}`}>
                    <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                    <Subset key={subset.id} setSlug={subset.slug} />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {((setData?.data?.sets && setData?.data?.sets.length === 0) || setError) && <p>No set found</p>}
      </div>
    </ResponsiveContainer>
  );
};

const MemoizedCardGallery = memo(CardGallery);
const MemoizedCardTable = memo(CardTable);

const CenteredSkeleton = styled(Skeleton)({
  margin: '0 auto',
});
