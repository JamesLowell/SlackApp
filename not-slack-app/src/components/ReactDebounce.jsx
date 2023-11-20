import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncevalue] = useState(value) 
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncevalue(value)
        }, delay)

        return () => clearTimeout(timeout);
    }, [value, delay])
    return debouncedValue
}