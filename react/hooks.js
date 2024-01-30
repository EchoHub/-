/**
 * @name 自定义hook实现
 */

/**
 * @name 获取最近ref的值
 * @param {*} value 
 */
function useLatest(value) {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}

/**
 * @name 
 */
function useUnmount(fn) {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    useEffect(() => {
        return fn ? fn() : () => {}
    })
}

/**
 * @name 防抖
 * @param {*} fn 
 * @param {*} wait 
 */
function useDebounce(fn, debouncOptions) {
    const fnRef = useLatest(fn);
    const wait = debouncOptions.wait || 200;
    const debounced = useMemo(() => {
        return debounced((...args) => {
            return fnRef.current(...args)
        },
        wait,
        debouncOptions
        )
    }, [])

    useUnmount(() => {
        debounced.cancel()
    })

    return {
        run: debounced,
        cancel: debounced.cancel,
        flush: debounced.flush
    }
}

/**
 * @name 截流
 * @param {*} fn 
 * @param {*} delay 
 */
function useThrottle(fn, throttleOptions) {
    const fnRef = useLatest(fn);
    const delay = throttleOptions.delay

    const throttle = useMemo(() => {
        return throttle(args => fnRef.current(args), delay, options)
    }, [])

    useUnmount(fn);

    return {
        rum: throttle,
        cancel: throttle.cancel
    }
}

/**
 * @name 用于给一个异步函数添加竞态锁，以防止并发
 * @param {*} fn 
 */
function useLockFn(fn) {
    const lockRef = useRef(false);
    return useCallback(async (...args) => {
        if (lockRef.current) return;
        lockRef.current = true;
        try {
            const result = await fn(...args);
            lockRef.current = false;
            return result;
        } catch (error) {
            lockRef.current = false;
            throw error;
        }
    }, [fn])
}


function useRequest() {

}

function useUrlState() {}

