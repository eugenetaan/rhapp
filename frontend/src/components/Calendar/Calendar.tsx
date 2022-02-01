import { type } from 'os'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DayHeaders } from './DayHeaders'
import { MonthlyContainer } from './MontlyContainer'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const MonthsHeaderContainer = styled.div`
  height: 40px;
  width: 93px;
  color: #58b994;
  margin-left: 10px;
  font-weight: 600;
`

const DatesGridContainer = styled.div`
  display: grid;
  grid-template-columns: 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px;
`

export const Calendar = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1).toDateString().slice(4, -7)
  const secondMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).toDateString().slice(4, -7)
  const thirdMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1).toDateString().slice(4, -7)
  const fourthMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1).toDateString().slice(4, -7)
  const fifthMonth = new Date(today.getFullYear(), today.getMonth() + 4, 1).toDateString().slice(4, -7)

  return (
    <CalenderContainer>
      <MonthsHeaderContainer>
        {firstMonth} {currentYear}
      </MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer nthMonth={0} />
      </DatesGridContainer>
      <MonthsHeaderContainer>{secondMonth}</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer nthMonth={1} />
      </DatesGridContainer>
      <MonthsHeaderContainer>{thirdMonth}</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer nthMonth={2} />
      </DatesGridContainer>
      <MonthsHeaderContainer>{fourthMonth}</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer nthMonth={3} />
      </DatesGridContainer>
      <MonthsHeaderContainer>{fifthMonth}</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer nthMonth={4} />
      </DatesGridContainer>
    </CalenderContainer>
  )
}
