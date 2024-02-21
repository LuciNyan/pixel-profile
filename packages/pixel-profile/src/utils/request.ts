import axios, { type AxiosRequestConfig } from 'axios'

type AxiosRequestConfigData = AxiosRequestConfig['data']
type AxiosRequestConfigHeaders = AxiosRequestConfig['headers']

export function request(data: AxiosRequestConfigData, headers: AxiosRequestConfigHeaders) {
  return axios({
    url: 'https://api.github.com/graphql',
    method: 'post',
    headers,
    data
  })
}
