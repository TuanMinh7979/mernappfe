import { useEffect, useState } from 'react';
    //debouncedValue will be set after 500 milisec after setUserSearchText call so 
    // => useEffect call after 500s since the time input search change, and
    // => also check isSearching == true when input change 
    // const debouncedValue = useDebounce(userSearchText, 1000);

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {

    const timer = setTimeout(() => 
   
       setDebounceValue(value), delay || 500
    

    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
};
export default useDebounce;
