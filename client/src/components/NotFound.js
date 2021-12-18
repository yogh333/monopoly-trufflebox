import {useEffect} from "react";

function NotFound() {
  useEffect(() => {
    window.location.href = "/"
  }, [])

  return (<>MERDE</>)
}

export default NotFound