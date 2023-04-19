import { Localized } from '@fluent/react'
import * as React from 'react'

type Props = {
  firstPartId: string
  secondPartId: string
  icon: JSX.Element
}

export const Instruction: React.FC<Props> = ({
  firstPartId,
  secondPartId,
  icon,
}) => (
  <div className="instruction">
    <Localized id={firstPartId}>
      <span />
    </Localized>
    {icon}
    <Localized id={secondPartId}>
      <span />
    </Localized>
  </div>
)
