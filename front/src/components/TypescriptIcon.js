import { useContext } from 'react'

import Icon from '@material-ui/core/Icon'

import { ReactComponent as TypescriptSvg } from '../icons/typescript.svg'

import ThemeTypeContext from '../ThemeTypeContext'

function TypescriptIcon(props) {
  const [themeType] = useContext(ThemeTypeContext)

  return (
    <Icon {...props}>
      <TypescriptSvg
        width={16}
        fill={themeType === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)'}
      />
    </Icon>
  )
}

export default TypescriptIcon
