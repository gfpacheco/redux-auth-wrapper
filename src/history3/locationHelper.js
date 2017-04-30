import url from 'url'

const defaults = {
  redirectQueryParamName: 'redirect',
  locationSelector: ({ location }) => location
}

export default (args) => {
  const { redirectQueryParamName, locationSelector } = {
    ...defaults,
    ...args
  }

  const getRedirectQuery = (props) => {
    const location = locationSelector(props)
    return location.query[redirectQueryParamName]
  }

  const createRedirectLoc = allowRedirectBack => (props, redirectPath) => {
    const location = locationSelector(props)
    const redirectLoc = url.parse(redirectPath, true)

    let query
    const canRedirect = typeof allowRedirectBack === 'function' ? allowRedirectBack(location, redirectPath) : allowRedirectBack

    if (canRedirect) {
      query = { [redirectQueryParamName]: `${location.pathname}${location.search}${location.hash}` }
    } else {
      query = {}
    }

    query = {
      ...query,
      ...redirectLoc.query
    }

    return {
      pathname: redirectLoc.pathname,
      hash: redirectLoc.hash,
      query
    }
  }

  return {
    getRedirectQuery,
    createRedirectLoc
  }
}