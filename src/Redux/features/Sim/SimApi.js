import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const simApi = createApi({
  reducerPath: 'simApi',
  tagTypes: ['SIM'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/managesim.php' }),
  endpoints: (builder) => ({
    getNumbers: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, action: 'get_numbers' },
      }),
      providesTags: ['SIM'],
    }),
    addNumber: builder.mutation({
      query: ({ credentials, Number }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...Number, action: 'add_number' },
      }),
      invalidatesTags: ['SIM'],
    }),
    deleteNumber: builder.mutation({
      query: ({ credentials, Number }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, number: Number.number, action: 'delete_number' },
      }),
      invalidatesTags: ['SIM'],
    }),
  }),
})
export const { useGetNumbersQuery, useAddNumberMutation, useDeleteNumberMutation } = simApi
