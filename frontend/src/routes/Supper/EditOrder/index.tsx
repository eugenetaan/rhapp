import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { BubbleSection } from '../../../components/Supper/BubbleSection'
import { MaxPriceFixer } from '../../../components/Supper/MaxPriceFixer'
import { RestaurantBubbles } from '../../../components/Supper/RestaurantBubbles'
import { PaymentInfo, Restaurants, SplitACMethod } from '../../../store/supper/types'
import { paymentMethods, restaurantList } from '../../../store/stubs'
import { RootState } from '../../../store/types'
import { Radio, Switch, TimePicker } from 'antd'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import Button from '../../../components/Mobile/Button'
import moment from 'moment'
import { setEditOrderNumber, unixTo12HourTime } from '../../../store/supper/action'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

//943PM

const Background = styled.form`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 3rem;
`

const StyledText = styled.text<{ topMargin?: boolean }>`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  ${(props) => props.topMargin && 'margin-top: 1rem;'}
  width: 100%;
`

const Input = styled.input`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

const OISection = styled.div`
  display: flex;
  flex-direction: column;
`

const SecondSubSection = styled.div<{ topMargin?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(props) => props.topMargin && 'margin-top: 1rem'}
`

const DISection = styled.div`
  display: flex;
  flex-direction: column;
`

const RadioButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`

const ButtonContainer = styled.div`
  margin: 1rem auto 0 auto;
  display: flex;
  justify-content: center;
`

const PICSection = styled.div`
  displau: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
`

const StyledTimePicker = styled(TimePicker)`
  width: 70%;
  margin: 5px auto 0 auto;
`

const RedText = styled.text`
  color: red;
`

const ErrorText = styled.p`
  margin: 5px 0 -10px 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const StyledSwitch = styled(Switch)`
  width: fit-content;
  &.ant-switch-checked {
    background-color: #002642;
  }
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

type FormData = {
  supperGroupName: string
  restuarant: string
  closingTime: number
  maxPrice: number
  estDeliveryFee: number
  splitDeliveryFee: SplitACMethod
  paymentMethod: PaymentInfo
}

const EditOrder = () => {
  const dispatch = useDispatch()
  const [hasMaxPrice, setHasMaxPrice] = useState(false)
  const { editOrderNumber, selectedPaymentMethod } = useSelector((state: RootState) => state.supper)
  const { register, handleSubmit, watch, setValue, clearErrors, setError, control, errors } = useForm<FormData>()
  const RedAsterisk = <RedText>*</RedText>

  const onChange = (time, timeString) => {
    if (!time || !timeString) {
      setValue('closingTime', undefined)
      setError('closingTime', { type: 'required' })
      return
    }
    console.log(time._d)
    console.log(timeString)
    const currentUNIXDate = Math.round(Date.now() / 1000)

    let epochClosingTime = moment(time._d).unix()
    if (currentUNIXDate > epochClosingTime) {
      epochClosingTime += 24 * 60 * 60 // Add a day
    }
    console.log(epochClosingTime)
    console.log(unixTo12HourTime(epochClosingTime))
    setValue('closingTime', epochClosingTime)
    clearErrors('closingTime')
  }

  const orderInformationSection = () => {
    return (
      <OISection>
        <StyledText>Order Name{RedAsterisk}</StyledText>
        <Input
          type="text"
          placeholder="Supper group name"
          name="supperGroupName"
          ref={register({
            required: true,
            validate: (input) => input.trim().length !== 0,
          })}
          style={{
            borderColor: errors.supperGroupName && 'red',
            background: errors.supperGroupName && '#ffd1d1',
          }}
        />
        {errors.supperGroupName?.type === 'required' && <ErrorText>Order Name required!</ErrorText>}
        {errors.supperGroupName?.type === 'validate' && <ErrorText>Invalid Order Name!</ErrorText>}
        <StyledText topMargin>Restaurant</StyledText>
        <RestaurantBubbles isDisabled defaultRestaurant={Restaurants.McDonalds} restaurantList={restaurantList} />
        <StyledText topMargin>Closing Time{RedAsterisk}</StyledText>
        <Controller
          name="closingTime"
          control={control}
          rules={{ required: true }}
          render={() => (
            <StyledTimePicker
              use12Hours
              format="h:mm a"
              onChange={onChange}
              ref={register({ required: true })}
              style={{
                borderColor: errors.closingTime && 'red',
                background: errors.closingTime && '#ffd1d1',
              }}
            />
          )}
        />
        {errors.supperGroupName?.type === 'required' && <ErrorText>Closing Time required!</ErrorText>}
        <StyledText topMargin>Max Price</StyledText>
        <PriceContainer>
          Set maximum total price
          <StyledSwitch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onClick={() => setHasMaxPrice(!hasMaxPrice)}
            defaultChecked={hasMaxPrice}
          />
        </PriceContainer>
        {/* <Controller 
        render={({ field }) => <TextField {...field} />} 
        name="firstName"
        control={control} 
        rules={ required: true } 
        defaultValue=""
      /> */}
        {hasMaxPrice && <MaxPriceFixer center />}
      </OISection>
    )
  }

  const deliveryInformationSection = () => {
    return (
      <DISection>
        <SecondSubSection>
          <StyledText>Est. Delivery Fees{RedAsterisk}</StyledText> <Input />
        </SecondSubSection>
        <SecondSubSection topMargin>
          <StyledText>Split Delivery Fees{RedAsterisk}</StyledText>
          <RadioButtonsSection>
            <input type="radio" value={SplitACMethod.EQUAL} />
            <input type="radio" value={SplitACMethod.PROPORTIONAL} />
          </RadioButtonsSection>
        </SecondSubSection>
      </DISection>
    )
  }

  const paymentInformationSection = () => {
    return (
      <PICSection>
        <StyledText>Payment Method{RedAsterisk}</StyledText>
        <PaymentMethodBubbles paymentMethods={paymentMethods} />
        {selectedPaymentMethod
          //   .sort((a, b) => a.localeCompare(b))
          .map((pm, index) => {
            return <Input key={index} placeholder={pm} />
          })}
      </PICSection>
    )
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (errors.supperGroupName || errors.closingTime) {
      dispatch(setEditOrderNumber(1))
      console.log('HELLLOO')
    }
    console.log(watch())
    console.log(errors)
    console.log('Form was submitted!')
    handleSubmit((data: FormData) => {
      console.log(data)
    })()
  }

  return (
    <Background onSubmit={onSubmit}>
      <TopNavBar title="Edit Order" />
      <BubbleSection canHide isOpen={editOrderNumber === 1} title="Order Information" number={1}>
        {orderInformationSection()}
      </BubbleSection>
      <BubbleSection canHide isOpen={editOrderNumber === 2} title="Delivery Information" number={2}>
        {deliveryInformationSection()}
      </BubbleSection>
      <BubbleSection canHide isOpen={editOrderNumber === 3} title="Payment Information" number={3}>
        {paymentInformationSection()}
      </BubbleSection>
      <ButtonContainer>
        <Button
          htmlType="submit"
          stopPropagation
          defaultButtonDescription="Save Changes"
          buttonHeight="2.5rem"
          descriptionStyle={{
            fontFamily: 'Inter',
            fontWeight: 200,
            fontSize: '17px',
          }}
          //   onButtonClick={() => console.log('Save changes!!')}
          isFlipButton={false}
        />
      </ButtonContainer>
    </Background>
  )
}

export default EditOrder
