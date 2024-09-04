import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/home.php' }),
  keepUnusedDataFor: 10,
  endpoints: (builder) => ({
    home: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
  }),
})
export const { useHomeQuery } = homeApi
