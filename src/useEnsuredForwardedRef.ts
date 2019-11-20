import {
  forwardRef,
  useRef,
  useEffect,
  MutableRefObject,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  RefForwardingComponent,
  PropsWithChildren,
} from 'react';

export default function useEnsuredForwardedRef<T>(
  forwardedRef: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null
) {
  const ensuredRef = useRef(
    forwardedRef && "current" in forwardedRef ? forwardedRef.current : null
  );

  useEffect(() => {
    if (!forwardedRef) {
      return;
    } else if (typeof forwardedRef === "function") {
      forwardedRef(ensuredRef.current);
    } else {
      forwardedRef.current = ensuredRef.current;
    }
  }, [forwardedRef]);

  return ensuredRef;
}

export function ensuredForwardRef<T, P = {}>(
  Component: RefForwardingComponent<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  return forwardRef((props: PropsWithChildren<P>, ref) => Component(props, useEnsuredForwardedRef(ref)));
}
