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
  foodPrice?: number
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
  price: number
  custom?: Custom[]
}

export type Restaurant = {
  restaurantId: string
  name: string
  restaurantLogo: string
  menu: FoodMenu[]
}

export type Order = {
  orderId: string
  user: User
  supperGroupId: string
  userContact?: number
  foodList: Food[]
  totalCost: number
  hasPaid: boolean //1 if user paid owner (user POV)
  paymentMethod: PaymentMethod
  hasReceived: boolean //1 if owner received payment (owner POV)
  createdAt: number
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
  status: SupperGroupStatus
  location: string //collection point
  deliveryDuration: number
  arrivalTime: number // = creationTime + estimated delivery duration
  closingTime: string
  createdAt: number
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
  GET_ALL_RESTAURANTS = 'SUPPER_ACTIONS.GET_ALL_RESTAURANTS',
  GET_ALL_SUPPER_GROUPS = 'SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS',
  GET_COLLATED_ORDER = 'SUPPER_ACTIONS.GET_COLLATED_ORDER',
  GET__SELECTED_SUPPER_IDS = 'SUPPER_ACTIONS.GET__SELECTED_SUPPER_IDS',
  SET_COUNT = 'SUPPER_ACTIONS.SET_COUNT',
  SET_PRICE_LIMIT = 'SUPPER_ACTIONS.SET_PRICE_LIMIT',
  SET_EXPANDABLE_CARD_STATUS = 'SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS',
  SET_SELECTED_PAYMENT_METHOD = 'SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type GetAllRestaurants = {
  type: typeof SUPPER_ACTIONS.GET_ALL_RESTAURANTS
  allRestaurants: Restaurant[]
}

type GetAllSupperGroups = {
  type: typeof SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS
  allSupperGroups: SupperGroup[]
}

type GetCollatedOrder = {
  type: typeof SUPPER_ACTIONS.GET_COLLATED_ORDER
  collatedOrder: CollatedOrder | null
}

type GetSelectedSupperIds = {
  type: typeof SUPPER_ACTIONS.GET__SELECTED_SUPPER_IDS
  selectedSupperGroupId: string | null
  selectedOrderId: string | null
  selectedRestaurantId: string | null
  selectedFoodId: string | null
}

type SetCount = {
  type: typeof SUPPER_ACTIONS.SET_COUNT
  count: number
}

type SetPriceLimit = {
  type: typeof SUPPER_ACTIONS.SET_PRICE_LIMIT
  priceLimit: number
}

type SetExpandableCardStatus = {
  type: typeof SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS
  isExpanded: boolean
}

type SetSelectedPaymentMethod = {
  type: typeof SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD
  selectedPaymentMethod: PaymentMethod[]
}

export type ActionTypes =
  | SetIsLoading
  | GetAllRestaurants
  | GetAllSupperGroups
  | GetCollatedOrder
  | GetSelectedSupperIds
  | SetCount
  | SetPriceLimit
  | SetExpandableCardStatus
  | SetSelectedPaymentMethod
