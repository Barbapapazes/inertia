import { createElement, forwardRef, useCallback } from 'react'
import { router, mergeDataIntoQueryString, shouldIntercept } from '@inertiajs/core'

const noop = () => undefined

export default forwardRef(function Link(
  {
    children,
    as = 'a',
    data = {},
    href,
    method = 'get',
    preserveScroll = false,
    preserveState = null,
    replace = false,
    only = [],
    headers = {},
    queryStringArrayFormat = 'brackets',
    onClick = noop,
    onCancelToken = noop,
    onBefore = noop,
    onStart = noop,
    onProgress = noop,
    onFinish = noop,
    onCancel = noop,
    onSuccess = noop,
    onError = noop,
    ...props
  },
  ref,
) {
  const visit = useCallback(
    (event) => {
      onClick(event)

      if (shouldIntercept(event)) {
        event.preventDefault()

        router.visit(href, {
          data,
          method,
          preserveScroll,
          preserveState: preserveState ?? method !== 'get',
          replace,
          only,
          headers,
          onCancelToken,
          onBefore,
          onStart,
          onProgress,
          onFinish,
          onCancel,
          onSuccess,
          onError,
        })
      }
    },
    [
      data,
      href,
      method,
      preserveScroll,
      preserveState,
      replace,
      only,
      headers,
      onClick,
      onCancelToken,
      onBefore,
      onStart,
      onProgress,
      onFinish,
      onCancel,
      onSuccess,
      onError,
    ],
  )

  as = as.toLowerCase()
  method = method.toLowerCase()
  const [_href, _data] = mergeDataIntoQueryString(method, href || '', data, queryStringArrayFormat)
  href = _href
  data = _data

  if (as === 'a' && method !== 'get') {
    console.warn(
      `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="${href}" method="${method}" as="button">...</Link>`,
    )
  }

  return createElement(
    as,
    {
      ...props,
      ...(as === 'a' ? { href } : {}),
      ref,
      onClick: visit,
    },
    children,
  )
})