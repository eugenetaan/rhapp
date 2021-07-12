import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { V1_BACKGROUND, V1_RED } from '../../../common/colours'

import LoadingSpin from '../../../components/LoadingSpin'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { CloseGroupEarlyModal } from '../../../components/Supper/Modals/CloseGroupEarlyModal'
import { DeleteGroupModal } from '../../../components/Supper/Modals/DeleteGroupModal'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import useSnackbar from '../../../hooks/useSnackbar'
import { deleteFoodInOrder, getCollatedOrder, getSupperGroupById, getUserOrder } from '../../../store/supper/action'
import { SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
`

const MainContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  background: ${V1_BACKGROUND};
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  justify-content: center;
  margin: 40px auto 40px auto;
  padding: 0 10px;
`

const UpperRowButtons = styled.div`
  display: flex;
  flex-direction: row;
`

const UpperRowButtonContainer = styled.div<{ left?: boolean | undefined }>`
  width: 50%;
  text-align: ${(props) => (props.left ? 'left' : 'right')};
`

const LowerRowButton = styled.div`
  margin: 25px 0 0;
`

const ViewCart = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [closeGroupModalIsOpen, setCloseGroupModalIsOpen] = useState<boolean>(false)
  const [deleteGroupModalIsOpen, setDeleteGroupModalIsOpen] = useState<boolean>(false)
  const [error] = useSnackbar('error')
  const { supperGroup, order, isLoading, foodId, collatedOrder } = useSelector((state: RootState) => state.supper)
  const isOwner = supperGroup?.ownerId ? localStorage.userID === supperGroup.ownerId : undefined
  const isEditable = supperGroup?.status === SupperGroupStatus.OPEN || supperGroup?.status === SupperGroupStatus.PENDING
  const ownerOrderId = supperGroup?.orderList?.find((order) => order.user.userID === localStorage.userID)?.orderId

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [dispatch])

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  const onConfirmDiscardClick = () => {
    if (order && foodId) dispatch(deleteFoodInOrder(order.orderId, foodId))
    else {
      error('Failed to delete item, please try again.')
    }
    setModalIsOpen(false)
  }

  const showButtons = () => {
    if (isOwner === undefined) {
      return <LoadingSpin />
    } else if (isOwner) {
      return (
        <ButtonContainer>
          <UpperRowButtons>
            <UpperRowButtonContainer left>
              <SupperButton
                defaultButtonColor={V1_BACKGROUND}
                defaultTextColor={V1_RED}
                border={`2px solid ${V1_RED}`}
                buttonWidth="90%"
                defaultButtonDescription="Delete Order"
                onButtonClick={() => setDeleteOrderModalIsOpen(true)}
                isFlipButton={true}
              />
              {deleteOrderModalIsOpen && (
                <DeleteOrderModal
                  isOwner
                  supperGroupId={supperGroup?.supperGroupId ?? '-'}
                  orderId={ownerOrderId}
                  modalSetter={setDeleteOrderModalIsOpen}
                />
              )}
            </UpperRowButtonContainer>
            <UpperRowButtonContainer>
              <SupperButton
                buttonWidth="90%"
                defaultButtonDescription="Close Group"
                onButtonClick={() => setCloseGroupModalIsOpen(true)}
                isFlipButton={false}
              />
              {closeGroupModalIsOpen && (
                <CloseGroupEarlyModal
                  supperGroupId={supperGroup?.supperGroupId ?? '-'}
                  modalSetter={setCloseGroupModalIsOpen}
                />
              )}
            </UpperRowButtonContainer>
          </UpperRowButtons>
          <LowerRowButton>
            <SupperButton
              center
              defaultButtonColor={V1_BACKGROUND}
              defaultTextColor={V1_RED}
              border={`2px solid ${V1_RED}`}
              buttonWidth="100%"
              defaultButtonDescription="Delete Group"
              onButtonClick={() => setDeleteGroupModalIsOpen(true)}
              isFlipButton={true}
            />
            {deleteGroupModalIsOpen && (
              <DeleteGroupModal
                suppergroupId={supperGroup?.supperGroupId ?? '-'}
                modalSetter={setDeleteGroupModalIsOpen}
              />
            )}
          </LowerRowButton>
        </ButtonContainer>
      )
    } else {
      return (
        <ButtonContainer>
          <SupperButton
            center
            defaultButtonDescription="Submit Order"
            onButtonClick={() => {
              if (supperGroup?.phoneNumber) {
                history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
              } else {
                history.push(`${PATHS.CONFIRM_ORDER}/${params.supperGroupId}/confirm`)
              }
            }}
            isFlipButton={false}
          />
        </ButtonContainer>
      )
    }
  }

  return (
    <Background>
      <MainContainer>
        <TopNavBar title="View Cart" />
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            {modalIsOpen && (
              <ConfirmationModal
                title={'Delete Item?'}
                hasLeftButton={true}
                leftButtonText={'Confirm'}
                onLeftButtonClick={onConfirmDiscardClick}
                rightButtonText={'Cancel'}
                onRightButtonClick={onCancelClick}
              />
            )}
            {supperGroup && collatedOrder && (
              <>
                <SupperGroupCard supperGroup={supperGroup} isHome={false} />
                <OrderCard supperGroup={supperGroup} collatedOrder={collatedOrder} isEditable={isEditable} />
              </>
            )}
            {showButtons()}
          </>
        )}
      </MainContainer>
      <BottomNavBar />
    </Background>
  )
}

export default ViewCart
