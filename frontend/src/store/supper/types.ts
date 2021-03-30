export type User = {
  _id: string
  userID: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
}

export type Food = {
  foodId: string
  comments?: string
  quantity: number
  foodMenu: FoodMenu
}

export type Option = {
  name: string
  isSelected: boolean
  price: number
}

// type Custom refers to a section in the customization page
export type Custom = {
  title: string
  options: Option[]
  max: number | null
  min: number
  customNumber: number //to order the sections in the order card
}

export type FoodMenu = {
  foodMenuId: string
  restaurantId: string
  foodMenuName: string
  price: string
  custom?: Custom[]
}

export type Restaurant = {
  restaurantId: string
  name: string
  menu: FoodMenu[]
}

export type Order = {
  orderId: string
  user: string
  supperGroupId: string
  userContact?: number
  foodList: Food[]
  totalCost: number
  hasPaid: boolean //1 if user paid owner (user POV)
  paymentMethod: PaymentMethod
  hasReceived: boolean //1 if owner received payment (owner POV)
}

export type SupperGroup = {
  supperGroupId: string
  supperGroupName: string
  owner: string
  ownerName: string
  paymentInfo: PaymentInfo[]
  restaurantName: string
  allUsers: User[]
  orderList: Order[]
  additionalCost?: number //ie GST, delivery fee
  splitAdditionalCost: SplitACMethod
  currentFoodCost: number //non inclusive of additionalCost
  costLimit: number
  status: string
  location: string //collection point
  deliveryDuration: number
  arrivalTime: number // = creationTime + estimated delivery duration
  closingTime: string
}

export type CollatedOrder = {
  supperGroupId: string
  ownerId: string
  collatedOrderList: Food[]
}

export enum SplitACMethod {
  PROPORTIONAL = 'Proportional',
  EQUAL = 'Equal',
}

export enum SupperGroupStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ORDERED = 'Ordered',
  ARRIVED = 'Arrived',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum PaymentMethod {
  PAYLAH = 'PayLah!',
  PAYNOW = 'PayNow',
  GOOGLEPAY = 'GooglePay',
  CASH = 'Cash',
}

export type PaymentInfo = {
  paymentMethod: PaymentMethod
  link?: string
}

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LOADING',
  GET_COLLATED_ORDER = 'SUPPER_ACTION.GET_COLLATED_ORDER',
  GET_ORDER_BY_ID = 'SUPPER_ACTION.GET_ORDER_BY_ID',
  GET_ORDER_BY_USER = 'SUPPER_ACTION.GET_ORDER_BY_USER',
  SET_ORDER_BY_ID = 'SUPPER_ACTION.SET_ORDER_BY_ID',
  GET_ALL_RESTAURANTS_INFO = 'SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO',
  GET_RESTAURANT_BY_ID = 'SUPPER_ACTIONS.GET_RESTAURANT_BY_ID',
  GET_FOOD_BY_ID = 'SUPPER_ACTIONS.GET_FOOD_BY_ID',
  SET_FOOD_BY_ID = 'SUPPER_ACTIONS.SET_FOOD_BY_ID',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetCollatedOrder = {
  type: typeof SUPPER_ACTIONS.GET_COLLATED_ORDER
  collatedOrder: CollatedOrder | null
}

type GetOrderById = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_BY_ID
  order: Order | null
}

type GetOrderByUser = {
  type: typeof SUPPER_ACTIONS.GET_ORDER_BY_USER
  order: Order | null
}

type SetOrder = {
  type: typeof SUPPER_ACTIONS.SET_ORDER_BY_ID
  order: Order | null
}

type GetAllRestaurantsInfo = {
  type: typeof SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO
  allRestaurants: Restaurant[]
}

type GetRestaurantById = {
  type: typeof SUPPER_ACTIONS.GET_RESTAURANT_BY_ID
  restaurant: Restaurant
}

type GetFoodById = {
  type: typeof SUPPER_ACTIONS.GET_FOOD_BY_ID
  food: Food
}

type SetFoodById = {
  type: typeof SUPPER_ACTIONS.SET_FOOD_BY_ID
  food: Food
}

export type ActionTypes =
  | SetIsLoading
  | GetAllRestaurantsInfo
  | GetRestaurantById
  | GetOrderById
  | GetOrderByUser
  | GetCollatedOrder
  | SetOrder
  | GetFoodById
  | SetFoodById
