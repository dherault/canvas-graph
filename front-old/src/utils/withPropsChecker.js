/* eslint-disable */
// https://gist.github.com/sqren/780ae8ca1e2cf59050b0695c901b5aa3
import { Component } from 'react'

function withPropsChecker(WrappedComponent) {
  return class PropsChecker extends Component {
    componentWillReceiveProps(nextProps) {
      Object.keys(nextProps)
        .filter(key => nextProps[key] !== this.props[key])
        .map(key => {
          console.log(
            'changed property:',
            key,
            'from',
            this.props[key],
            'to',
            nextProps[key]
          )
        })
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withPropsChecker
