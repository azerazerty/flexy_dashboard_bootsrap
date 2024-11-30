import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminOperationsApi = createApi({
  reducerPath: 'adminOperationsApi',
  tagTypes: ['ADMIN_OPERATIONS'],

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fftopup.store/Flexy/',
  }),
  endpoints: (builder) => ({
    adminOperations: builder.query({
      query: (credentials) => ({
        url: 'getadminoperations.php',
        method: 'POST',
        body: { ...credentials },
      }),
      providesTags: ['ADMIN_OPERATIONS'],
    }),
    confirmOperation: builder.mutation({
      query: ({ credentials, Operation }) => ({
        url: 'getadminoperations.php',
        method: 'POST',
        body: { ...credentials, ...Operation, action: 'conferme_operation' },
      }),
      invalidatesTags: ['ADMIN_OPERATIONS'],
    }),
  }),
})
export const { useAdminOperationsQuery, useConfirmOperationMutation } = adminOperationsApi
