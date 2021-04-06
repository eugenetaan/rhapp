import { Reducer } from 'redux'
import { ActionTypes, Restaurant, CollatedOrder, SupperGroup, PaymentMethod } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  allRestaurants: [],
  allSupperGroups: [],
  collatedOrder: null,
  selectedSupperGroupId: null,
  selectedOrderId: null,
  selectedRestaurantId: null,
  selectedFoodId: null,
  count: 0,
  priceLimit: 0,
  isExpanded: false,
  selectedPaymentMethod: [],
}

type State = {
  isLoading: boolean
  allRestaurants: Restaurant[]
  allSupperGroups: SupperGroup[]
  collatedOrder: CollatedOrder | null
  selectedSupperGroupId: string | null
  selectedOrderId: string | null
  selectedRestaurantId: string | null
  selectedFoodId: string | null
  count: number
  priceLimit: number
  isExpanded: boolean
  selectedPaymentMethod: PaymentMethod[]
}

export const supper: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SUPPER_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case SUPPER_ACTIONS.GET_ALL_RESTAURANTS: {
      return { ...state, allRestaurants: action.allRestaurants }
    }
    case SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS: {
      return { ...state, allSupperGroups: action.allSupperGroups }
    }
    case SUPPER_ACTIONS.GET_COLLATED_ORDER: {
      return { ...state, collatedOrder: action.collatedOrder }
    }
    case SUPPER_ACTIONS.GET__SELECTED_SUPPER_IDS: {
      return {
        ...state,
        selectedSupperGroupId: action.selectedSupperGroupId,
        selectedOrderId: action.selectedOrderId,
        selectedRestaurantId: action.selectedRestaurantId,
        selectedFoodId: action.selectedFoodId,
      }
    }
    case SUPPER_ACTIONS.SET_COUNT: {
      return { ...state, count: action.count }
    }
    case SUPPER_ACTIONS.SET_PRICE_LIMIT: {
      return { ...state, priceLimit: action.priceLimit }
    }
    case SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS: {
      return { ...state, isExpanded: action.isExpanded }
    }
    case SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD: {
      return { ...state, selectedPaymentMethod: action.selectedPaymentMethod }
    }
    default:
      return state
  }
}
