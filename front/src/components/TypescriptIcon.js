import Icon from '@material-ui/core/Icon'

import { ReactComponent as TypescriptSvg } from '../icons/typescript.svg'

function TypescriptIcon(props) {
  const { color = 'white' } = props

  return (
    <Icon {...props}>
      <TypescriptSvg
        width={16}
        fill={color}
      />
    </Icon>
  )
}

export default TypescriptIcon
