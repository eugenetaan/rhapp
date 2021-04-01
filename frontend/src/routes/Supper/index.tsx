import React from 'react'

import { SmileOutlined } from '@ant-design/icons'
import { StatusSymbol } from '../../components/Supper/StatusSymbol'
import { MainSGCard } from '../../components/Supper/MainSGCard'
import { RadioSection } from '../../components/Supper/RadioSection'
import { Custom } from '../../store/supper/types'

export default function Supper() {
  const dummy: Custom = {
    title: 'Drinks',
    options: [
      { name: 'milo', isSelected: true, price: 0 },
      { name: 'coke', isSelected: false, price: 0.2 },
    ],
    max: null,
    min: 1,
    customNumber: 1,
  }

  return (
    <>
      <StatusSymbol isClicked backgroundColor="bluegrey" leftIcon={<SmileOutlined />} preText="est." text="Ordered" />
      <MainSGCard title="f> SUPPER FRIENDS" time="11:59PM" users={17} orderId="RHSO#1002" />
      <RadioSection data={dummy} />
    </>
  )
}
