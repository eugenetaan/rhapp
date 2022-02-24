import React from 'react'
import { BookingStatusEntry } from '../../store/facilityBooking/types'
import { StyledBookingBlock, TextContainer } from './BlockStyles'

type Props = {
  bookingEntry: BookingStatusEntry
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const BookingBlock = (props: Props) => {
  console.log(props)
  return (
    <StyledBookingBlock onClick={props.onClick} type={props.bookingEntry.type} ccaId={props.bookingEntry.id}>
      {props.bookingEntry.type === 'occupied' && <TextContainer>Occupied</TextContainer>}
      {(props.bookingEntry.type === 'available' || props.bookingEntry.type === 'selected') && (
        <TextContainer>Available</TextContainer>
      )}
    </StyledBookingBlock>
  )
}

export default BookingBlock