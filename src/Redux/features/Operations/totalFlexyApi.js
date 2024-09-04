import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const totalFlexyApi = createApi({
  reducerPath: 'totalFlexyApi',
  tagTypes: ['TOTAL'],
  keepUnusedDataFor: 5,
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/totalflexy.php' }),
  endpoints: (builder) => ({
    getTotal: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, number_filter: 'all_numbers', credit_filter: 'all_credits' },
      }),
      providesTags: ['TOTAL'],
    }),
    applyFilter: builder.mutation({
      query: ({ credentials, Filter }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...Filter },
      }),
      // invalidatesTags: ['TOTAL'],
    }),
  }),
})
export const { useGetTotalQuery, useApplyFilterMutation } = totalFlexyApi
