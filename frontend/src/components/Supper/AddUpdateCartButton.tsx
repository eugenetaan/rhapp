import React from 'react'

import { RedButton } from './RedButton'

type Props = {
  update?: boolean
  add?: boolean
  width?: string
  leftText?: string
  currentTotal: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export const AddUpdateCartButton = (props: Props) => {
  const LEFT_TEXT = props.update ? 'Update Cart' : props.add ? 'Add to Cart' : props.leftText
  const RIGHT_TEXT = `$${props.currentTotal}`

  return <RedButton width={props.width ?? '100%'} onClick={props.onClick} leftText={LEFT_TEXT} rightText={RIGHT_TEXT} />
}
