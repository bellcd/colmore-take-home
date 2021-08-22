import { actions } from './actions';


export const rootReducer = (state, action) => {
    let stateToMerge;
    switch (action.type) {
      case actions.setKeyword:
        stateToMerge = { keyword: action.payload }
        break;
      case actions.setSecuritiesData:
        stateToMerge = { securitiesData: action.payload }
        break;
      case actions.setSelectedSecuritySymbol:
        stateToMerge = { selectedSecuritySymbol: action.payload }
        break;
      case actions.setSelectedSecuritySymbol5MinuteData:
        stateToMerge = { selectedSecuritySymbol5MinuteData: action.payload }
        break;
      case actions.setSelectedSecuritySymbol60MinuteData:
        stateToMerge = { selectedSecuritySymbol60MinuteData: action.payload }
        break;
      case actions.setSelectedSecuritySymbolIndicatorSMAData:
        stateToMerge = { selectedSecuritySymbolIndicatorSMAData: action.payload }
        break;
      case actions.setHasApikey:
        stateToMerge = { hasApikey: action.payload }
        break;
      case actions.setApikey:
        stateToMerge = { apikey: action.payload }
        break;
      case actions.setIsLoading:
        stateToMerge = { isLoading: action.payload }
        break;
      case actions.setGlobalQuoteInfo:
        stateToMerge = { globalQuoteInfo: action.payload }
        break;
      case actions.setHasError:
        stateToMerge = { hasError: action.payload }
        break;
      default:
        return state;
    }
    return {
      ...state,
      ...stateToMerge
    }
  };