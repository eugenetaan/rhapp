import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import 'antd/dist/antd.css'
import Button from '../../../components/Mobile/Button'
import { Slider } from 'antd'
import { WashingMachine, WMStatus } from '../../../store/laundry/types'
import wm_inuse from '../../../assets/washing-machines/wm_inuse.gif'
import wm_available from '../../../assets/washing-machines/wm_available.svg'
import wm_reserved from '../../../assets/washing-machines/wm_reserved.svg'
import wm_uncollected from '../../../assets/washing-machines/wm_uncollected.svg'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  SetDuration,
  SetEditMode,
  SetSelectedMachineFromId,
  UpdateJobDuration,
  updateMachine,
  SetBlockLevelSelections,
} from '../../../store/laundry/action'
import { useParams } from 'react-router-dom'
import { onRefresh } from '../../../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'
import { padStart } from 'lodash'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4; !important
`
const StyledSlider = styled(Slider)`
  padding: 23px;
  padding-bottom: 35px;
`
const WashingMachineDetails = styled.div`
  padding: 23px;
  display: flex;
`
const WashingMachineActionGroup = styled.div`
  padding: 23px;
`
const TimeLeft = styled.div`
  display: flex;
`
const TimeLeftText = styled.p`
  font-weight: bold;
  font-size: 26px;
  color: #002642;
  text-align: center;
  line-height: 0px;
  padding: 0px 10px 0px 10px;
`
const WashingMachineTitle = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 25px;
  color: #002642;
`

const UseWashingMachineSection = styled.div`
  padding: 23px;
  text-align: center;
`

const TimeLabel = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #023666;
`

const TimeUnit = styled.div``

const UnderLineButton = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 18px;
  line-height: 14px;
  text-align: center;
  text-decoration-line: underline;
  padding-left: 20px;
  color: #de5f4c;
`

const MachineSize = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 30px;
  color: #023666;
`

const EditDuration = styled.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-align: left;
`

export default function ViewWashingMachine() {
  const { selectedBlock, selectedLevel, selectedMachine, isEdit, duration } = useSelector(
    (state: RootState) => state.laundry,
  )
  const dispatch = useDispatch()
  const params = useParams<{ machineId: string }>()
  const [minuteState, useMinuteState] = useState('')
  const [secondState, useSecondState] = useState('')

  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | undefined>()

  useEffect(() => {
    dispatch(SetSelectedMachineFromId(params.machineId))
    useMinuteState(
      calculateRemainingTime('minutes', selectedMachine?.startTime as number, selectedMachine?.duration as number),
    )
    useSecondState(
      calculateRemainingTime('seconds', selectedMachine?.startTime as number, selectedMachine?.duration as number),
    )

    if (selectedMachine != null) {
      if (intervalID != undefined) {
        clearInterval(intervalID)
      }
      const idinterval = setInterval(() => {
        useMinuteState(
          calculateRemainingTime('minutes', selectedMachine?.startTime as number, selectedMachine?.duration as number),
        )
        useSecondState(
          calculateRemainingTime('seconds', selectedMachine?.startTime as number, selectedMachine?.duration as number),
        )
      }, 1000)
      setIntervalID(idinterval)
    }
  }, [dispatch, selectedMachine])

  const calculateRemainingTime = (type: string, startUNIX: number, duration: number) => {
    const endDateTime = new Date((startUNIX + duration) * 1000)
    const timeNowDateTime = new Date()

    const durationLeftInMiliSeconds: number = Math.abs(timeNowDateTime.getTime() - endDateTime.getTime())

    if (durationLeftInMiliSeconds < 0) {
      dispatch(updateMachine(WMStatus.AVAIL, selectedMachine?.machineID as string))
      dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
    }

    const timeDiffInSeconds = durationLeftInMiliSeconds / 1000
    const minutes: string = Math.floor(timeDiffInSeconds / 60).toFixed(0)
    const seconds: string = padStart((timeDiffInSeconds - 60 * parseInt(minutes)).toFixed(0), 2, '0')
    return type === 'minutes' ? minutes : type === 'seconds' ? seconds : ''
  }

  const MachineDetails = (machine: WashingMachine | null) => {
    let pageTitle = 'Laundry Time!'
    let actions = <></>
    let subtitle = <></>
    let imagesrc = ''
    const authorized = machine?.userID === localStorage.getItem('userID')

    const timeLeftGroup = (
      <TimeLeft>
        <TimeUnit>
          <TimeLeftText>{minuteState}</TimeLeftText> <TimeLabel>minutes</TimeLabel>
        </TimeUnit>
        <TimeLeftText> : </TimeLeftText>
        <TimeUnit>
          <TimeLeftText> {secondState} </TimeLeftText> <TimeLabel>seconds</TimeLabel>
        </TimeUnit>
        {!isEdit && authorized && machine?.job === WMStatus.INUSE && (
          <UnderLineButton onClick={() => dispatch(SetEditMode())}>Edit</UnderLineButton>
        )}
      </TimeLeft>
    )
    switch (machine?.job) {
      case WMStatus.AVAIL:
        subtitle = <TimeLabel>{"It's Washy Time!"}</TimeLabel>
        pageTitle = 'Laundry Time'
        imagesrc = wm_available
        break
      case WMStatus.INUSE:
        subtitle = timeLeftGroup
        pageTitle = isEdit ? 'Update Duration' : 'In Use'
        imagesrc = wm_inuse
        break
      case WMStatus.COMPLETED:
      case WMStatus.UNCOLLECTED:
        pageTitle = 'Collect Laundry'
        imagesrc = wm_uncollected
        actions = authorized ? (
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Collect Laundry'}
            defaultButtonColor="#002642DD"
            updatedButtonColor="#002642DD"
            updatedTextColor="white"
            onButtonClick={() => {
              dispatch(updateMachine(WMStatus.AVAIL, machine?.machineID))
              dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
              history.back()
            }}
          />
        ) : (
          <div></div>
        )
        break
      case WMStatus.RESERVED:
        subtitle = timeLeftGroup
        pageTitle = 'Reservation'
        imagesrc = wm_reserved
        actions = authorized ? (
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Cancel Reservation'}
            defaultButtonColor="#002642DD"
            updatedButtonColor="#002642DD"
            updatedTextColor="white"
            onButtonClick={() => {
              dispatch(updateMachine(WMStatus.AVAIL, machine?.machineID))
              dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
              history.back()
            }}
          />
        ) : (
          <div></div>
        )
        break
    }
    return (
      <>
        <TopNavBar title={pageTitle} />
        <WashingMachineDetails>
          <img src={imagesrc} style={{ width: '40%', height: '30%' }} />
          <WashingMachineActionGroup>
            <WashingMachineTitle>
              S/N {machine?.machineID}
              <MachineSize>({machine?.capacity} kg)</MachineSize>
            </WashingMachineTitle>
            {subtitle}
            {actions}
          </WashingMachineActionGroup>
        </WashingMachineDetails>
      </>
    )
  }

  const UseWashineMachine = (machine: WashingMachine | null) => {
    const authorized = machine?.userID === localStorage.getItem('userID')
    if (machine?.job === WMStatus.RESERVED && authorized) {
      return (
        <UseWashingMachineSection>
          <EditDuration> Select Duration </EditDuration>
          <StyledSlider
            min={1}
            max={machine?.job === WMStatus.RESERVED && isEdit ? 15 : 120}
            tooltipVisible
            onChange={(value: number) => {
              dispatch(SetDuration(value))
              useMinuteState(
                calculateRemainingTime('minutes', machine?.startTime as number, machine?.duration as number),
              )
              useSecondState(
                calculateRemainingTime('seconds', machine?.startTime as number, machine?.duration as number),
              )
            }}
            value={duration}
            trackStyle={{ backgroundColor: '#023666' }}
            handleStyle={{ borderColor: '#023666', height: '15px', width: '15px' }}
          />
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={isEdit ? 'Update Duration' : 'Use Washing Machine'}
            defaultButtonColor="#DE5F4C"
            updatedButtonColor="#DE5F4C"
            updatedTextColor="white"
            onButtonClick={() => {
              if (isEdit) {
                dispatch(SetEditMode())
                dispatch(UpdateJobDuration(machine.machineID))
                dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
              } else {
                dispatch(updateMachine(WMStatus.INUSE, machine?.machineID))
                dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
                // Update washing machine state here / history.back()
              }
            }}
          />
          {isEdit && (
            <Button
              style={{ marginLeft: '23px' }}
              hasSuccessMessage={false}
              stopPropagation={false}
              defaultButtonDescription={'Cancel'}
              defaultButtonColor="#FAFAF4"
              updatedButtonColor="#FAFAF4"
              updatedTextColor="#000000"
              onButtonClick={() => {
                dispatch(SetEditMode())
              }}
            />
          )}
        </UseWashingMachineSection>
      )
    } else if (machine?.job === WMStatus.INUSE && authorized) {
      return (
        <UseWashingMachineSection>
          {isEdit && <EditDuration> Select Duration </EditDuration>}
          {isEdit && (
            <StyledSlider
              min={1}
              max={120}
              tooltipVisible
              onChange={(value: number) => {
                dispatch(SetDuration(value))
                useMinuteState(
                  calculateRemainingTime('minutes', machine?.startTime as number, machine?.duration as number),
                )
                useSecondState(
                  calculateRemainingTime('seconds', machine?.startTime as number, machine?.duration as number),
                )
              }}
              value={duration}
              trackStyle={{ backgroundColor: '#023666' }}
              handleStyle={{ borderColor: '#023666', height: '15px', width: '15px' }}
            />
          )}
          <Button
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={isEdit ? 'Update Duration' : 'Stop Washing'}
            defaultButtonColor="#DE5F4C"
            updatedButtonColor="#DE5F4C"
            updatedTextColor="white"
            onButtonClick={() => {
              if (isEdit && authorized) {
                dispatch(SetEditMode())
                dispatch(UpdateJobDuration(machine.machineID))
                dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
              } else {
                dispatch(updateMachine(WMStatus.AVAIL, machine?.machineID))
                dispatch(SetBlockLevelSelections(selectedBlock as string, selectedLevel as string))
                history.back()
              }
            }}
          />
          {isEdit && authorized && (
            <Button
              style={{ marginLeft: '23px' }}
              hasSuccessMessage={false}
              stopPropagation={false}
              defaultButtonDescription={'Cancel'}
              defaultButtonColor="#FAFAF4"
              updatedButtonColor="#FAFAF4"
              updatedTextColor="#000000"
              onButtonClick={() => {
                dispatch(SetEditMode())
              }}
            />
          )}
        </UseWashingMachineSection>
      )
    } else if (machine?.job === WMStatus.AVAIL && authorized) {
      return (
        <UseWashingMachineSection>
          <Button
            style={{ marginLeft: '23px' }}
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Reserve'}
            defaultButtonColor="#FAFAF4"
            updatedButtonColor="#FAFAF4"
            updatedTextColor="#000000"
            onButtonClick={() => {
              dispatch(updateMachine(WMStatus.AVAIL, machine.machineID))
            }}
          />
        </UseWashingMachineSection>
      )
    }
  }

  return (
    <MainContainer>
      <PullToRefresh onRefresh={onRefresh}>
        {MachineDetails(selectedMachine)}
        {UseWashineMachine(selectedMachine)}
      </PullToRefresh>
      <BottomNavBar />
    </MainContainer>
  )
}
