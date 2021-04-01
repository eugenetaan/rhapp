import React from 'react'
import styled from 'styled-components'

import { Radio } from 'antd'
import { Option } from '../../store/supper/types'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  data: Option[]
}

export const RadioSection = (props: Props) => {
  return (
    <MainContainer>
      {props.data.map((option, index) => {
        return (
          <RadioButton key={index} checked={option.isSelected}>
            {`${option.name} (${option.price})`}
          </RadioButton>
        )
      })}
    </MainContainer>
  )
}
