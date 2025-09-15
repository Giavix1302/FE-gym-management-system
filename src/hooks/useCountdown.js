import { useEffect, useRef, useState } from "react"
import { computeRemaining } from "~/utils/common"

export function useCountdown(expireAtInput, { tick = 1000, onExpire } = {}) {
  const [state, setState] = useState(() => computeRemaining(expireAtInput))
  const onExpireRef = useRef(onExpire)

  // luôn giữ callback mới nhất
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    setState(computeRemaining(expireAtInput))

    if (!expireAtInput) return
    const id = setInterval(() => {
      const result = computeRemaining(expireAtInput)
      setState(result)

      if (result.expired) {
        clearInterval(id)
        if (onExpireRef.current) onExpireRef.current() // gọi callback
      }
    }, tick)

    return () => clearInterval(id)
  }, [expireAtInput, tick])

  return state
}
