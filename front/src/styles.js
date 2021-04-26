import flexpadCss from 'flexpad/dist/flexpad.css'

import commonCss from './index.css'

import theme from './theme'

export function __(...args) {
  return args.join(' ')
}

export function createCommonStyles() {
  let css = `
${flexpadCss}
${commonCss}
*::selection {
  color: white;
  background-color: ${theme.palette.secondary.main};
}
.red {
  color: ${theme.palette.red[500]};
}
.green {
  color: ${theme.palette.green[500]};
}
  `

  /* ---
    Create margin and padding CSS classes
    such as
    mt-1, mx-auto, py-4, etc...
  --- */
  ;[
    ['m', 'margin'],
    ['p', 'padding'],
  ].forEach(([mp, mpKey]) => {
    [
      ['', ''],
      ['x', 'left', 'right'],
      ['y', 'top', 'bottom'],
      ['t', 'top'],
      ['b', 'bottom'],
      ['l', 'left'],
      ['r', 'right'],
    ].forEach(([xytblr, ...xytblrKeys]) => {
      [
        0,
        0.5,
        1,
        1.5,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        10,
        12,
        'auto',
      ].forEach(spacing => {
        css += `.${mp}${xytblr}-${spacing.toString().replace(/\.5/, 'h')} {\n`

        xytblrKeys.forEach(key => {
          css += `${mpKey}${key ? `-${key}` : ''}: ${spacing === 'auto' ? 'auto' : `${theme.spacing(spacing)}px`} !important;\n`
        })

        css += '}\n'
      })
    })
  })

  return css
}

// Inject CSS if on browser
if (typeof window !== 'undefined') {
  // Attach CSS to document
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')

  head.appendChild(style)

  const css = createCommonStyles()

  if (style.styleSheet) {
    // This is required for IE8 and below. LOL.
    style.styleSheet.cssText = css
  }
  else {
    style.appendChild(document.createTextNode(css))
  }
}
