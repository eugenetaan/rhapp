import React from 'react'
import { useDispatch } from 'react-redux'

import { SupperModal } from './SupperModal'
import { deleteSupperGroup } from '../../../store/supper/action'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  suppergroupId: number | string
}

export const DeleteGroupModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(deleteSupperGroup(props.suppergroupId))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="Delete Group?"
      description="Deleting group will remove everyone’s cart and delete supper group."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
