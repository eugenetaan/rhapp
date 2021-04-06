import React, { ReactChild, ReactChildren } from 'react'

import styled from 'styled-components'
import editIcon from '../../assets/SupperEditIcon.svg'

const MainContainer = styled.div<{ flexDirection?: string; minHeight?: string }>`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: ${(props) => props.minHeight ?? '70px'};
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: 15px;
  flex-direction: ${(props) => props.flexDirection ?? ''};
`

const EditIcon = styled.img<{ editIconSize?: string }>`
  position: absolute;
  margin: 5px 20px;
  right: 0;
  height: ${(props) => props.editIconSize ?? 'auto'};
`

interface AuxProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
  flexDirection?: string
  minHeight?: string
  isEditable?: boolean
  editIconSize?: string
}

export const MainCard = (props: AuxProps) => {
  return (
    <MainContainer minHeight={props.minHeight} flexDirection={props.flexDirection}>
      {props.children}
      {props.isEditable && <EditIcon editIconSize={props.editIconSize} src={editIcon} alt="Edit Icon" />}
    </MainContainer>
  )
}
