import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminOperationsApi = createApi({
  reducerPath: 'adminOperationsApi',
  tagTypes: ['ADMIN_OPERATIONS'],

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fftopup.store/Flexy/getadminoperations.php',
  }),
  endpoints: (builder) => ({
    adminOperations: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials },
      }),
      providesTags: ['ADMIN_OPERATIONS'],
    }),
  }),
})
export const { useAdminOperationsQuery } = adminOperationsApi
