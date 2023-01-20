import init, { convert } from '../wasm/pkg'
import { useEffect, useState } from 'react'

type State = {
    loaded: false,
} | {
    loaded: true,
    ok: true,
    convert: typeof convert
} | {
    loaded: true,
    ok: false,
}

const useWasm = () => {
    const [state, setState] = useState<State>({
        loaded: false,
    })

    useEffect(() => {
        init().then(()=>{
          setState({
            loaded: true,
            ok: true,
            convert
          })
        }).catch((error)=>{
            console.error(error)
            setState({
                loaded: false,
                ok: false
            })
        })
      }, []);

      return state
}
 
export default useWasm