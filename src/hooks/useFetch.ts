import { useEffect, useState } from 'react'

type Maybe<T> = T | undefined | null

const useFetch = <DataType>(defaultUrl: string) => {
  const [data, setData] = useState<Maybe<DataType>>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Maybe<Error>>(null)

  const fetchData = async (url: string) => {
    setLoading(true)
    try {
      const res = await fetch(url)
      const json = await res.json()
      setData(json.result)
    } catch (e) {
      console.log(e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(defaultUrl)
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

export default useFetch
