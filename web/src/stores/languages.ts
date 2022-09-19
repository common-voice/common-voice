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

export const actions = {
  loadLocalesData: () => {
    return async (
      dispatch: Dispatch<LoadedAction>,
      getState: () => StateTree
    ) => {
      const { api } = getState();
      const allLanguages = await api.fetchAllLanguages();

      console.log({ allLanguages });

      //get obj of native names, default to language code
      const nativeNames = allLanguages.reduce((names: any, language) => {
        names[language.name] = language.native_name ?? language.name;
        return names;
      }, {});

      //get array of rtl languages
      const rtlLocales = allLanguages.reduce((names: any, language) => {
        if (language.text_direction === 'RTL') {
          names.push(language.name);
        }
        return names;
      }, []);

      const translatedLocales = allLanguages.reduce((names: any, language) => {
        if (language.is_translated) {
          names.push(language.name);
        }
        return names;
      }, []);

      const allLocales = allLanguages.map(language => language.name);
      const contributableLocales = allLanguages
        .filter(language => language.is_contributable)
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
