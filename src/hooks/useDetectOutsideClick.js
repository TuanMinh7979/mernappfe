import { useEffect, useState } from 'react';
// use for dropdown
const useDetectOutsideClick = (ref, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (event) => {
      console.log("MOUSE DOWN IN WINDOW", ref, ref.current);
      if ( ref.current !== null && !ref.current.contains(event.target)) {
        console.log("goto here to set isActive");
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      console.log("CLICK ON WINDOW call onClick", ref)
      window.addEventListener('mousedown', onClick);
    }

    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive];
};
export default useDetectOutsideClick;
