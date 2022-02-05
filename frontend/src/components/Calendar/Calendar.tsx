import React, { useState } from 'react'
import styled from 'styled-components'

import { DayHeaders } from './DayHeaders'
import { MonthlyContainer } from './MonthlyContainer'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const YearContainer = styled.div`
  width: calc(47.14px * 7);
  font-weight: 600;
  color: #58b994;
  text-align: center;
  padding-top: 10px;
`

const MonthContainer = styled.div`
  padding-bottom: 5px;
`

const MonthsHeaderContainer = styled.div`
  width: 93px;
  color: #58b994;
  margin-top: 10px;
  margin-left: 10px;
  padding-bottom: 20px;
  font-weight: 600;
`

const DatesGridContainer = styled.div`
  display: grid;
  grid-template-columns: 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px;
`

// this component takes in an array of events or an array of dates that has events
export const Calendar = () => {
  // event dates are stored as UNIX format
  // dummy dates with events : 5th Feb, 5th Mar, 29th Mar, 2nd Apr
  const eventDays: number[] = [1644072529, 1646491729, 1648565329, 1648910929]

  // dummy dates with events : 1st Mar, 3rd Mar, 31st Mar, 31st Jan (In component friendly format)
  const processedDates: number[] = [204, 301, 303, 331, 131]

  // conert unix dates into component friendly format
  const convertDates = (unprocessedDate: number) => {
    const month = new Date(unprocessedDate * 1000).getMonth() + 1
    const day = new Date(unprocessedDate * 1000).getDate()
    const processedDate = month * 100 + day
    processedDates.push(processedDate)
    return processedDate
  }

  eventDays.forEach((date) => convertDates(date))

  const today = new Date()
  let startingMonth = 0
  const currentYear = today.getFullYear()
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const secondMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const thirdMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1)
  const fourthMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1)
  const fifthMonth = new Date(today.getFullYear(), today.getMonth() + 4, 1)
  const monthLists: Date[] = [secondMonth, thirdMonth, fourthMonth, fifthMonth]

  return (
    <CalenderContainer>
      <YearContainer>{currentYear}</YearContainer>
      <MonthContainer>
        <MonthsHeaderContainer>{firstMonth.toDateString().slice(4, -7)}</MonthsHeaderContainer>
        <DatesGridContainer>
          <DayHeaders />
          <MonthlyContainer nthMonth={startingMonth++} eventDates={processedDates} />
        </DatesGridContainer>
      </MonthContainer>
      <>
        {monthLists.map((month) => {
          if (month.getMonth() === 0) {
            // Note: 0 stands for Jan
            return (
              <>
                <YearContainer>{currentYear + 1}</YearContainer>
                <MonthContainer key={startingMonth++}>
                  <MonthsHeaderContainer>{month.toDateString().slice(4, -7)}</MonthsHeaderContainer>
                  <DatesGridContainer>
                    <DayHeaders />
                    <MonthlyContainer nthMonth={startingMonth} eventDates={processedDates} />
                  </DatesGridContainer>
                </MonthContainer>
              </>
            )
          }
          return (
            <MonthContainer key={startingMonth++}>
              <MonthsHeaderContainer>{month.toDateString().slice(4, -7)}</MonthsHeaderContainer>
              <DatesGridContainer>
                <DayHeaders />
                <MonthlyContainer nthMonth={startingMonth} eventDates={processedDates} />
              </DatesGridContainer>
            </MonthContainer>
          )
        })}
      </>
    </CalenderContainer>
  )
}
