import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BrowseState = {
  isFormVisible: false,
  searchQuery: '',
  oracleTextQuery: '',
  cardTypes: [],
  cardColors: {
    white: false,
    blue: false,
    black: false,
    red: false,
    green: false,
    colorless: false,
    type: 'at-least-these-colors',
  },
  showAllPrintings: true,
};

const browseSlice = createSlice({
  name: 'browse',
  initialState,
  reducers: {
    setFormVisibility(state, action: PayloadAction<FormVisibility>) {
      const { isFormVisibile } = action.payload;
      state.isFormVisible = isFormVisibile;
    },
    setSearchQuery(state, action: PayloadAction<SearchQuery>) {
      const { searchQuery } = action.payload;
      state.searchQuery = searchQuery;
    },
    setOracleTextQuery(state, action: PayloadAction<OracleTextQuery>) {
      const { oracleTextQuery } = action.payload;
      state.oracleTextQuery = oracleTextQuery;
    },
    setCardTypes(state, action: PayloadAction<CardTypes>) {
      const { cardTypes } = action.payload;
      state.cardTypes = cardTypes;
    },
    setCardColors(state, action: PayloadAction<string>) {
      const color = action.payload;
      state.cardColors[color] = !state.cardColors[color];
    },
    setColorType(state, action: PayloadAction<ColorTypes>) {
      const type = action.payload;
      state.cardColors.type = type;
    },
    setShowAllPrintings(state, action: PayloadAction<boolean>) {
      const showAllPrintings = action.payload;
      state.showAllPrintings = showAllPrintings;
    },
  },
});

export const {
  setFormVisibility,
  setSearchQuery,
  setOracleTextQuery,
  setCardTypes,
  setCardColors,
  setColorType,
  setShowAllPrintings,
} = browseSlice.actions;

interface BrowseState {
  isFormVisible: boolean;
  searchQuery: string;
  oracleTextQuery: string;
  cardTypes: CardType[];
  cardColors: CardColors;
  showAllPrintings: boolean;
}

export interface CardType {
  category: string;
  label: string;
  value: string;
  exclude: boolean;
}

export interface CardColors {
  white: boolean;
  blue: boolean;
  black: boolean;
  red: boolean;
  green: boolean;
  colorless: boolean;
  type: ColorTypes;
}

export type ColorTypes = 'at-least-these-colors' | 'only-these-colors' | 'at-most-these-colors';

export interface CardTypes {
  cardTypes: CardType[];
}

interface FormVisibility {
  isFormVisibile: boolean;
}

interface SearchQuery {
  searchQuery: string;
}

interface OracleTextQuery {
  oracleTextQuery: string;
}

export default browseSlice.reducer;
