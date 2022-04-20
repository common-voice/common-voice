import { Dispatch } from 'redux';
import StateTree from '../stores/tree';

type Locales = string[];

interface NativeNames {
  [property: string]: string;
}

export interface State {
  isLoading: boolean;
  allLocales?: Locales;
  contributableLocales?: Locales;
  nativeNames?: NativeNames;
  rtlLocales?: Locales;
  translatedLocales?: Locales;
}

enum ActionType {
  LOADED = 'LOADED',
}

interface LoadedAction {
  type: ActionType.LOADED;
  allLocales: Locales;
  contributableLocales: Locales;
  nativeNames: NativeNames;
  rtlLocales: Locales;
  translatedLocales: Locales;
}

export type Action = LoadedAction;

async function getLocaleData(fileName: string): Promise<Locales> {
  const response = await fetch(`/dist/locales/${fileName}.json`);
  return response.json();
}

async function getNativeNamesData(): Promise<NativeNames> {
  const response = await fetch(`/dist/locales/native-names.json`);
  return response.json();
}

export const actions = {
  loadLocalesData: () => {
    return async (
      dispatch: Dispatch<LoadedAction>,
      getState: () => StateTree
    ) => {
      const { api } = getState();

      const response = await Promise.all([
        api.fetchAllLanguages(),
        getNativeNamesData(),
        getLocaleData('rtl'),
        getLocaleData('translated'),
      ]);

      const [allLanguages, nativeNames, rtlLocales, translatedLocales] =
        response;

      const allLocales = allLanguages.map(language => language.name);
      const contributableLocales = allLanguages
        .filter(language => language.isContributable)
        .map(language => language.name);

      dispatch({
        type: ActionType.LOADED,
        allLocales,
        contributableLocales,
        nativeNames,
        rtlLocales,
        translatedLocales,
      });
    };
  },
};

const INITIAL_STATE = {
  isLoading: true,
};

export function reducer(state: State = INITIAL_STATE, action: Action): State {
  switch (action.type) {
    case ActionType.LOADED:
      return {
        ...state,
        isLoading: false,
        allLocales: action.allLocales,
        contributableLocales: action.contributableLocales,
        nativeNames: action.nativeNames,
        rtlLocales: action.rtlLocales,
        translatedLocales: action.translatedLocales,
      };

    default:
      return state;
  }
}
