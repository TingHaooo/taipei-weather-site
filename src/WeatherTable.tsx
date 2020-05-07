import Table, { TablePaginationConfig, TableProps } from 'antd/lib/table'
import React from 'react'

import { ApiSource, WeatherDocs } from './App'

interface WeatherTableProps {
  docs: WeatherDocs[]
  loading: boolean
  pagination: TablePaginationConfig
  handleTableChange: TableProps<WeatherDocs>['onChange']
  apiSource: ApiSource
}

const getColumns = (apiSource: ApiSource) => {
  return [
    {
      title: 'dataTime',
      dataIndex: 'dataTime',
      sorter:
        apiSource === ApiSource.SERVER
          ? (a, b) => new Date(a).getTime() - new Date(a).getTime()
          : undefined
    },
    {
      title: 'measures',
      dataIndex: 'measures'
    },
    {
      title: 'lon',
      dataIndex: 'lon'
    },
    {
      title: 'value',
      dataIndex: 'value',
      sorter: apiSource === ApiSource.SERVER ? (a, b) => a - b : undefined
    },
    {
      title: 'locationName',
      dataIndex: 'locationName',
      filterMultiple: false,
      filters: [
        { text: '文山區', value: '文山區' },
        { text: '萬華區', value: '萬華區' },
        { text: '中正區', value: '中正區' },
        { text: '大安區', value: '大安區' },
        { text: '信義區', value: '信義區' },
        { text: '南港區', value: '南港區' },
        { text: '大同區', value: '大同區' },
        { text: '中山區', value: '中山區' },
        { text: '松山區', value: '松山區' },
        { text: '內湖區', value: '內湖區' },
        { text: '士林區', value: '士林區' },
        { text: '北投區', value: '北投區' }
      ]
    },
    {
      title: 'geocode',
      dataIndex: 'geocode'
    },
    {
      title: 'lat',
      dataIndex: 'lat'
    }
  ]
}

const WeatherTable = (props: WeatherTableProps) => {
  const { docs, loading, handleTableChange, pagination, apiSource } = props

  return (
    <Table
      columns={getColumns(apiSource)}
      rowKey={record => record._id}
      dataSource={docs}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  )
}

export default WeatherTable
