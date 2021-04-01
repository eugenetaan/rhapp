import React from 'react'
import styled from 'styled-components'

import { Radio } from 'antd'
import { Custom } from '../../store/supper/types'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const TitleText = styled.div`
  font-weight: 500;
`

const OtherText = styled.text`
  font-weight: 200;
  font-size: 14px;
`

const RadioButton = styled(Radio)`
  .ant-radio-checked,
  .ant-radio-inner {
    border-color: #002642 !important;
    border-radius: 50%;
  }
  .ant-radio-checked,
  .ant-radio-inner:after {
    background-color: #002642;
  }

  .ant-radio:hover,
  .ant-radio-inner {
    border-color: #002642;
  }
`

type Props = {
  data: Custom
}

export const RadioSection = (props: Props) => {
  return (
    <MainContainer>
      <TitleText>{props.data.title}</TitleText>
      <>
        {props.data.options.map((option, index) => {
          return (
            <RadioButton key={index} checked={option.isSelected}>
              <OtherText>{`${option.name} ${option.price !== 0 ? `(+$${option.price})` : ''}`}</OtherText>
            </RadioButton>
          )
        })}
      </>
    </MainContainer>
  )
}
