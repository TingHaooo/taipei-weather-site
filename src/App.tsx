import 'antd/dist/antd.css'

import { TableProps } from 'antd/lib/table'
import { mergeDeepRight } from 'ramda'
import React, { useState } from 'react'

import useFetch from './hooks/useFetch'
import WeatherTable from './WeatherTable'

export interface WeatherDocs {
  _id: number
  dataTime: string
  geocode: string
  lat: string
  locationName: string
  lon: string
  value: string
}

export interface WeatherPagination {
  count: number
  limit: number
  offset: number
}

export interface WeatherInfo extends WeatherPagination {
  results: WeatherDocs[]
}

export enum ApiSource {
  OPEN_API = 'openApi',
  SERVER = 'server'
}

export const defaultPageSize = 10
export const defaultQuery = {
  offset: '0',
  limit: defaultPageSize.toString(),
  scope: 'resourceAquire',
  rid: '1f1aaba5-616a-4a33-867d-878142cac5c4'
}

export const defaultQueryString = new URLSearchParams(defaultQuery).toString()

export const openApiUrl = 'https://data.taipei/opendata/datalist/apiAccess?'
export const serverApiUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/tapei-weather?'
    : 'https://tapei-weather-api-2r5c07tiv.now.sh/tapei-weather?'

const ApiSourcei18n = {
  openApi: '台北市每日氣象資料 Open Api',
  server: '自建伺服器'
}

const App = () => {
  const [apiSource, setApiSrouce] = useState<ApiSource>(ApiSource.OPEN_API)
  const { data, loading, error, refetch } = useFetch<WeatherInfo>(
    openApiUrl + defaultQueryString
  )

  if (error) {
    if (apiSource === ApiSource.OPEN_API) {
      setApiSrouce(ApiSource.SERVER)
      refetch(serverApiUrl + defaultQueryString)
      return null
    }
    return <div>qq 都壞掉了</div>
  }

  if (!data) {
    return null
  }

  const handleTableChange: TableProps<WeatherDocs>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    let newQuery = {}
    if (pagination.current) {
      newQuery = {
        ...newQuery,
        offset: (pagination.current - 1) * defaultPageSize,
        limit: defaultPageSize
      }
    }
    if (filters?.locationName) {
      newQuery = {
        ...newQuery,
        q: filters.locationName[0]
      }
    }

    // 只有 server 開 sort api
    if (apiSource === ApiSource.SERVER) {
      if (sorter) {
        const { field, order } = sorter as any
        newQuery = {
          ...newQuery,
          sort: order && field && `${field}:${order}`
        }
      }
    }

    const targetUrl =
      apiSource === ApiSource.OPEN_API ? openApiUrl : serverApiUrl
    const mergedQuery = mergeDeepRight(defaultQuery, newQuery)

    refetch(targetUrl + new URLSearchParams(mergedQuery).toString())
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1>今日氣象資訊</h1>
      <div style={{ marginBottom: '10px' }}>
        資料來源: {ApiSourcei18n[apiSource]}
      </div>
      {
        <WeatherTable
          apiSource={apiSource}
          pagination={{
            defaultPageSize,
            total: data.count,
            showSizeChanger: false
          }}
          docs={data.results}
          loading={loading}
          handleTableChange={handleTableChange}
        />
      }
    </div>
  )
}

export default App
