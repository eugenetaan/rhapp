import React, { useState } from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import { UnderlinedButton } from '../UnderlinedButton'
import EmptyCart_src from '../../../assets/EmptyCart.svg'
import { CollatedOrder, Food, Order, SplitACMethod, SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { PlusCircleFilled } from '@ant-design/icons'
import { V1_RED } from '../../../common/colours'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../../routes/Routes'
import useSnackbar from '../../../hooks/useSnackbar'
import { FoodLine } from '../FoodLine'
import { Tabs } from '../../Tabs'
import { TelegramShareButton } from '../../TelegramShareButton'
import { openUserTelegram } from '../../../common/telegramMethods'
import { ContactModal } from '../ContactModal'
import { SGPaymentStatus } from './SGPaymentStatus'

const CardHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 17px;
  font-family: 'Inter';
  padding: 1rem 0;
`

const EmptyCartImg = styled.img`
  height: 61px;
  width: 55px;
`

const EmptyTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  font-size: 12px;
`

const MyOrderText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
`

const NameText = styled.text<{ isOwner?: boolean }>`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => (props.isOwner ? 'black' : 'rgba(0, 0, 0, 0.65)')};
`

const NameContainer = styled.div`
  display: flex;
  align-items: center;
`

const HorizontalLine = styled.hr`
  width: 100%;
  height: 1px;
  background: black;
  border: none;
`

const PriceMainContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: auto;
  grid-row-gap: 5px;
  align-items: center;
  padding-top: 7px;
`

const TotalTitleText = styled.text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  padding-top: 5px;
`

const TotalPriceText = styled.text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  justify-self: end;
  padding-top: 5px;
`

const PriceTitleText = styled.text`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
`

const PriceText = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  justify-self: end;
`

const SubtotalContainer = styled.div`
  padding: 10px 0 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const SubtotalText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`

const SubtotalPrice = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
`

const UpdateTextButton = styled.text<{ underlined?: boolean }>`
  padding: 0 7px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;
  color: ${V1_RED};
  ${(props) => props.underlined && 'text-decoration-line: underline;'}
`

type Props = {
  supperGroup?: SupperGroup | null
  ownerId: string | undefined
  supperGroupStatus: SupperGroupStatus | undefined
  isEditable?: boolean
  wasEdited?: boolean
  collatedOrder?: CollatedOrder | null
  order?: Order | null
  foodList?: Food[]
  deliveryCost?: number
  numberOfUsers?: number
  splitCostMethod?: SplitACMethod
  supperTotalCost?: number
  supperGroupId?: number | undefined
  orderId?: string | undefined
  restaurantId?: string | undefined
  margin?: string
}

export const OrderCard = (props: Props) => {
  const history = useHistory()
  const [isCancelActionModalOpen, setIsCancelActionModalOpen] = useState<boolean>(false)

  const orderList = props.supperGroup?.orderList
  const foodList = props.order?.foodList ?? props.foodList
  const collatedFoodList = props.collatedOrder?.collatedOrderList
  const isFoodListEmpty = ((foodList?.length ?? 0) <= 0) as boolean
  const isCollatedFoodListEmpty = ((collatedFoodList?.length ?? 0) <= 0) as boolean
  let wasEdited = props.wasEdited ?? false
  const supperGroupId = props.supperGroup?.supperGroupId ?? props.order?.supperGroupId ?? props.supperGroupId
  const orderId = props.order?.orderId ?? props.orderId
  const isOwner = localStorage.userID === (props.supperGroup?.ownerId ?? props.ownerId)
  const supperGroupStatus = props.supperGroup?.status ?? props.supperGroupStatus
  const supperGroupIsOpenOrPending =
    supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING
  const showTrackPaymentCard =
    isOwner && supperGroupStatus === (SupperGroupStatus.ARRIVED || SupperGroupStatus.AWAITING_PAYMENT)
  const canEditUserFood = isOwner && !supperGroupIsOpenOrPending
  const isEditable = props.isEditable ?? (!isOwner && supperGroupIsOpenOrPending)
  const restaurantId = props.supperGroup?.restaurantId ?? props.restaurantId
  const supperGroupDeliveryFee = props.supperGroup?.additionalCost ?? 0
  let subTotal
  let deliveryFee
  let total
  if (props.supperGroup && isOwner) {
    subTotal = props.supperGroup?.currentFoodCost ?? 0
    deliveryFee = supperGroupDeliveryFee
    total = props.supperGroup?.totalPrice ?? 0
  } else {
    const numberOfUsers = props.numberOfUsers ?? 1
    const isEqualMethod = props.splitCostMethod === SplitACMethod.EQUAL
    subTotal = props.order?.totalCost ?? 0
    const totalSupper = props.supperTotalCost ?? 0
    deliveryFee =
      (isEqualMethod
        ? (props.supperGroup?.additionalCost ?? 0) / numberOfUsers
        : totalSupper > 0 //to prevent infinity
        ? (subTotal / totalSupper) * (props.supperGroup?.additionalCost ?? 0)
        : 0) ?? 0
    total = subTotal + deliveryFee
  }

  const PriceSection = ({
    update,
    order,
    wasDeliveryUpdated,
  }: {
    update?: boolean
    order?: Order
    wasDeliveryUpdated?: boolean
  }) => {
    let priceSectionSubTotal = subTotal
    let priceSectionDeliveryFee = supperGroupDeliveryFee
    let priceSectionTotal = total
    if (order) {
      priceSectionSubTotal = order.totalCost
      priceSectionDeliveryFee = deliveryFee
    }
    priceSectionTotal = priceSectionSubTotal + priceSectionDeliveryFee
    return (
      <PriceMainContainer>
        <PriceTitleText>Subtotal</PriceTitleText>
        <PriceText>${priceSectionSubTotal.toFixed(2)}</PriceText>

        <PriceTitleText>
          Delivery Fee {/* TODO: Push to new page with update delivery price card */}
          {update && (supperGroupIsOpenOrPending || supperGroupStatus === SupperGroupStatus.CLOSED) && (
            <UpdateTextButton underlined onClick={() => console.log('GO TO NEW PAGE')}>
              update
            </UpdateTextButton>
          )}
          {wasDeliveryUpdated && !(supperGroupIsOpenOrPending || supperGroupStatus === SupperGroupStatus.CLOSED) && (
            <UpdateTextButton>(edited)</UpdateTextButton>
          )}
        </PriceTitleText>
        <PriceText>${priceSectionDeliveryFee.toFixed(2)}</PriceText>

        <TotalTitleText>Total</TotalTitleText>
        <TotalPriceText>${priceSectionTotal.toFixed(2)}</TotalPriceText>
      </PriceMainContainer>
    )
  }

  const EmptyCart = () => {
    return (
      <EmptyCartContainer>
        <EmptyCartImg alt="Empty Cart" src={EmptyCart_src} />
      </EmptyCartContainer>
    )
  }

  const OwnerEmptyCartSection = () => {
    return (
      <>
        <EmptyCart />
        <EmptyTextContainer>
          Cart is empty.{' '}
          <UnderlinedButton
            onClick={() => history.push(`${PATHS.PLACE_ORDER}/${supperGroupId}/${restaurantId}/order`)}
            text="Add item"
            fontSize="12px"
            color="red"
          />
        </EmptyTextContainer>
      </>
    )
  }

  const RedPlusButton = () => {
    return (
      <PlusCircleFilled
        onClick={() => history.push(`${PATHS.PLACE_ORDER}/${supperGroupId}/${restaurantId}/order`)}
        style={{ fontSize: '20px', color: V1_RED }}
      />
    )
  }

  const onEditClick = (foodId: string | undefined) => {
    if (!foodId) {
      const [error] = useSnackbar('error')
      error('meowmeow is in a bad mood.. try again later!')
      return
    }
    if (canEditUserFood) {
      //TODO: Add owner edit user's order modal (is now a card so push to new page)
    } else {
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${supperGroupId}/order/${orderId}/food/${foodId}`)
    }
  }

  const userViewFoodContent = () => (
    <>
      {isFoodListEmpty ? (
        <OwnerEmptyCartSection />
      ) : (
        <>
          {foodList?.map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            wasEdited = food.updates as boolean
            return (
              <FoodLine
                key={index}
                margin="5px 0"
                isEditable={isEditable}
                onEditClick={() => onEditClick(food.foodId)}
                wasEdited={wasEdited}
                isCancelActionClickable={isOwner}
                cancelActionModalSetter={setIsCancelActionModalOpen}
                food={food}
                supperGroupId={supperGroupId}
                orderId={orderId}
              />
            )
          })}
          <PriceSection />
        </>
      )}
    </>
  )

  const collatedFoodContent = () => (
    <>
      {isCollatedFoodListEmpty ? (
        <EmptyCart />
      ) : (
        <>
          {collatedFoodList?.map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            wasEdited = food.updates as boolean
            return (
              <>
                <FoodLine
                  key={index}
                  margin="5px 0"
                  isEditable={isEditable}
                  onEditClick={() => onEditClick(food.foodId)}
                  wasEdited={wasEdited}
                  isCancelActionClickable={isOwner}
                  cancelActionModalSetter={setIsCancelActionModalOpen}
                  cancelActionOnClick={() => {
                    setIsCancelActionModalOpen(true)
                  }}
                  food={food}
                  supperGroupId={supperGroupId}
                  orderId={orderId}
                />
                {isCancelActionModalOpen && (
                  <ContactModal orderList={orderList} food={food} contactModalSetter={setIsCancelActionModalOpen} />
                )}
              </>
            )
          })}
          <PriceSection update={isEditable} />
        </>
      )}
    </>
  )

  const ownerViewFoodContent = () => {
    const ownerFoodIsEditable =
      isOwner && (supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING)
    let formattedFoodList = orderList

    if (orderList) {
      const ownerOrder = orderList.find((order) => order.user.userID === localStorage.userID)
      if (ownerOrder) {
        formattedFoodList = orderList.filter((order) => {
          return order.user.userID !== localStorage.userID
        })
        formattedFoodList.unshift(ownerOrder)
      }
    }

    return (
      <>
        {formattedFoodList?.map((order) => {
          const isOwnerFood = order.user.userID === localStorage.userID
          const telegramHandle = order.user.telegramHandle
          const isOrderEmpty = ((order.foodList?.length ?? 0) <= 0) as boolean
          const topSection = (
            <CardHeaderContainer>
              <NameContainer>
                {!isOwnerFood && <TelegramShareButton margin="0 5px 0 0" telegramHandle={telegramHandle} />}
                <NameText isOwner={isOwnerFood}>{isOwnerFood ? 'You' : order.user.displayName}</NameText>
              </NameContainer>
              {ownerFoodIsEditable && isOwnerFood && <RedPlusButton />}
            </CardHeaderContainer>
          )
          const isOrderEditable = (supperGroupIsOpenOrPending && isOwnerFood) || isEditable
          const orderSubtotal = `$${order.totalCost.toFixed(2)}`
          const EmptyCartContainer = () => {
            if (isOwnerFood) {
              return <OwnerEmptyCartSection />
            } else {
              return <EmptyCart />
            }
          }

          const cancelActionOnClick = () => {
            if (!isOwnerFood) {
              return openUserTelegram(telegramHandle)
            }
          }

          return (
            <>
              {topSection}
              {isOrderEmpty ? (
                <EmptyCartContainer />
              ) : (
                order.foodList?.map((food, foodIndex) => {
                  const customisations: string[] = []
                  food.custom?.map((custom) =>
                    custom.options.map((option) => {
                      if (option.isSelected) customisations.push(option.name)
                    }),
                  )
                  wasEdited = food.updates as boolean
                  return (
                    <FoodLine
                      key={foodIndex}
                      margin="5px 0"
                      isEditable={isOrderEditable}
                      onEditClick={() => onEditClick(food.foodId)}
                      wasEdited={wasEdited}
                      isCancelActionClickable={isOwner && !isOwnerFood}
                      cancelActionOnClick={cancelActionOnClick}
                      food={food}
                      supperGroupId={supperGroupId}
                      orderId={orderId}
                    />
                  )
                })
              )}
              <SubtotalContainer>
                <SubtotalText>Subtotal</SubtotalText>
                <SubtotalPrice>{orderSubtotal}</SubtotalPrice>
              </SubtotalContainer>
              <HorizontalLine />
            </>
          )
        })}
        <PriceSection update={isEditable} />
      </>
    )
  }

  const ownerFoodContent = () => {
    const ownerOrder = (orderList ?? []).find((order) => order.user.userID === localStorage.userID)

    return (
      <>
        {ownerOrder ? (
          <>
            {ownerOrder.foodList?.map((food, foodIndex) => {
              const customisations: string[] = []
              food.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              wasEdited = food.updates as boolean
              return (
                <FoodLine
                  key={foodIndex}
                  margin="5px 0"
                  wasEdited={wasEdited}
                  food={food}
                  supperGroupId={supperGroupId}
                  orderId={orderId}
                />
              )
            })}
            <PriceSection order={ownerOrder} wasDeliveryUpdated />
          </>
        ) : (
          EmptyCart()
        )}
      </>
    )
  }

  const trackPaymentContent = () => {
    return (
      <>
        <SGPaymentStatus supperGroup={props.supperGroup} />
        <HorizontalLine />
        <PriceSection />
      </>
    )
  }

  return (
    <MainCard margin={props.margin} padding="20px" flexDirection="column">
      {isOwner ? (
        showTrackPaymentCard ? (
          <Tabs
            valueNamesArr={['My Order', 'Track Payment']}
            childrenArr={[ownerFoodContent(), trackPaymentContent()]}
          />
        ) : (
          <Tabs valueNamesArr={['User', 'Food']} childrenArr={[ownerViewFoodContent(), collatedFoodContent()]} />
        )
      ) : (
        <>
          <CardHeaderContainer>
            <MyOrderText>My Order</MyOrderText>
            {isEditable && <RedPlusButton />}
          </CardHeaderContainer>
          {userViewFoodContent()}
        </>
      )}
    </MainCard>
  )
}