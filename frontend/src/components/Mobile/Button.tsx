import React, { useState } from 'react'
import { Button as AntdButton } from 'antd'
import { message } from 'antd'

type Props = {
  buttonIsPressed?: boolean
  hasSuccessMessage: boolean
  stopPropagation: boolean
  defaultButtonDescription: string
  updatedButtonDescription?: string
  defaultButtonColor?: string
  updatedButtonColor?: string
  defaultTextColor?: string
  updatedTextColor?: string
  style?: React.CSSProperties
  onButtonClick?: (arg0: boolean) => void
  isFlipButton?: boolean
}

function Button(props: Props) {
  const [buttonIsPressed, setButtonIsPressed] = useState(props.buttonIsPressed ?? false)
  const [buttonColour, setButtonColour] = useState(
    props.buttonIsPressed
      ? props.updatedButtonColor ?? props.isFlipButton ?? true
        ? 'transparent'
        : props.defaultButtonColor ?? '#DE5F4C'
      : props.defaultButtonColor ?? '#DE5F4C',
  )
  const [textColour, setTextColour] = useState(props.buttonIsPressed ? '#ff7875' : props.defaultTextColor || 'white')

  const successfulAdd = () => {
    if (props.hasSuccessMessage) message.success('Successfully added to schedule!')
  }

  const successfulRemove = () => {
    if (props.hasSuccessMessage) message.warning('Successfully removed from schedule!')
  }

  return (
    <AntdButton
      danger
      style={
        props.style ?? {
          background: buttonColour,
          color: textColour,
          borderRadius: '5px',
        }
      }
      onClick={(e) => {
        {
          props.stopPropagation && e.stopPropagation()
        }
        buttonIsPressed ? successfulRemove() : successfulAdd()
        setButtonColour(
          buttonIsPressed
            ? props.defaultButtonColor ?? '#DE5F4C'
            : props.updatedButtonColor ?? props.isFlipButton ?? true
            ? 'transparent'
            : props.defaultButtonColor ?? '#DE5F4C',
        )
        setTextColour(
          buttonIsPressed
            ? props.defaultTextColor ?? 'white'
            : props.updatedTextColor ?? props.isFlipButton ?? true
            ? '#ff7875'
            : props.defaultTextColor ?? 'white',
        )
        setButtonIsPressed(!buttonIsPressed)
        if (props.onButtonClick) props.onButtonClick(buttonIsPressed)
      }}
    >
      {buttonIsPressed
        ? props.updatedButtonDescription ?? props.defaultButtonDescription
        : props.defaultButtonDescription}
    </AntdButton>
  )
}

export default Button
