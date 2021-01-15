import { Reducer } from 'redux'
import { ActionTypes, PROFILE_ACTIONS, User, UserCCA } from './types'

export const initialState = {
  user: {
    userId: 0,
    profilePictureUrl:
      'https://ichef.bbci.co.uk/news/1024/cpsprodpb/151AB/production/_111434468_gettyimages-1143489763.jpg',
    displayName: 'Your Profile is Loading',
    telegramHandle: 'zhoumm',
    block: 8,
    bio: 'This is my bio hur hur',
    ccas: [{ userId: '1', ccaId: 1, ccaName: 'RHDevs' }],
    modules: ['CS1010', 'CFG1000', 'CS2040S'],
    posts: [],
  },
  newDisplayName: '',
  newTelegramHandle: '',
  newBio: '',
  newCCAs: [],
  newModules: [],
}

type State = {
  user: User
  newDisplayName: string
  newTelegramHandle: string
  newBio: string
  newCCAs: UserCCA[]
  newModules: string[]
}

export const profile: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_USER_DETAILS: {
      return {
        ...state,
        user: action.user,
      }
    }
    case PROFILE_ACTIONS.EDIT_USER_DETAILS: {
      return {
        ...state,
        newDisplayName: action.newDisplayName,
        newTelegramHandle: action.newTelegramHandle,
        newBio: action.newBio,
        newCCAs: action.newCCAs,
        newModules: action.newModules,
      }
    }
    case PROFILE_ACTIONS.UPDATE_CURRENT_USER: {
      return {
        ...state,
        user: action.user,
      }
    }
    default:
      return state
  }
}