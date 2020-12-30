import dayjs from 'dayjs'
import { Reducer } from 'redux'
import { ActionTypes, FACILITY_ACTIONS, Facility, Booking } from './types'

const initialState = {
  // MAIN PAGE
  facilityList: [],
  locationList: [],
  selectedTab: '',
  myBookings: [],
  isDeleteMyBooking: -1,
  newBooking: undefined,
  // CREATE NEW BOOKING STATES
  newBookingName: '',
  newBookingFacilityName: '',
  newBookingFromDate: new Date(),
  newBookingToDate: dayjs(new Date()).add(1, 'hour').toDate(),
  newBookingCCA: '',
  newBookingDescription: '',
  createSuccess: false,
  createFailure: false,
  // VIEW FACILITY PARAMS
  ViewStartDate: new Date(),
  ViewEndDate: dayjs(new Date()).add(3, 'day').toDate(),
  ViewFacilityMode: 'Bookings',
}

type State = {
  facilityList: Facility[]
  locationList: string[]
  selectedTab: string
  myBookings: Booking[]
  isDeleteMyBooking: number
  newBooking: Booking | undefined
  newBookingFacilityName: string
  newBookingName: string
  newBookingFromDate: Date
  newBookingToDate: Date
  newBookingCCA: string
  newBookingDescription: string
  createSuccess: boolean
  createFailure: boolean
  ViewStartDate: Date
  ViewEndDate: Date
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FACILITY_ACTIONS.GET_FACILITY_LIST: {
      return {
        ...state,
        facilityList: action.facilityList,
        locationList: action.locationList,
      }
    }
    case FACILITY_ACTIONS.GET_MY_BOOKINGS: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.CHANGE_TAB: {
      return {
        ...state,
        selectedTab: action.newTab,
      }
    }
    case FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING: {
      return {
        ...state,
        isDeleteMyBooking: action.isDeleteMyBooking,
      }
    }
    case FACILITY_ACTIONS.DELETE_MY_BOOKING: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.EDIT_MY_BOOKING: {
      return {
        ...state,
        newBooking: action.newBooking,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_NAME: {
      return {
        ...state,
        newBookingName: action.newBookingName,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_FROM_DATE: {
      return {
        ...state,
        newBookingFromDate: action.newBookingFromDate,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_TO_DATE: {
      return {
        ...state,
        newBookingToDate: action.newBookingToDate,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_CCA: {
      return {
        ...state,
        newBookingCCA: action.newBookingCCA,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION: {
      return {
        ...state,
        newBookingDescription: action.newBookingDescription,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE: {
      return {
        ...state,
        ViewStartDate: action.ViewStartDate,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE: {
      return {
        ...state,
        ViewEndDate: action.ViewEndDate,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE: {
      return {
        ...state,
        ViewFacilityMode: action.ViewFacilityMode,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_FACILITY: {
      return {
        ...state,
        newBookingFacilityName: action.newBookingFacilityName,
      }
    }

    case FACILITY_ACTIONS.HANDLE_CREATE_BOOKING: {
      return {
        ...state,
        createFailure: action.createFailure,
        createSuccess: action.createSuccess,
      }
    }

    default:
      return state
  }
}