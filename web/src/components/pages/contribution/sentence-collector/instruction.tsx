import { Localized } from '@fluent/react'
import * as React from 'react'

type Props = {
  localizedId: string
  icon: JSX.Element
}

export const Instruction: React.FC<Props> = ({ localizedId, icon }) => (
  <div className="instruction">
    <Localized id={localizedId} elems={{ icon }}>
      <span />
    </Localized>
  </div>
)
