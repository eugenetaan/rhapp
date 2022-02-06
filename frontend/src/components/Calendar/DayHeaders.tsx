import React from 'react'
import styled from 'styled-components'

const DayContainer = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

export const DayHeaders = () => {
  const Days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <>
      {Days.map((day) => {
        return <DayContainer key={day}>{day}</DayContainer>
      })}
    </>
  )
}
