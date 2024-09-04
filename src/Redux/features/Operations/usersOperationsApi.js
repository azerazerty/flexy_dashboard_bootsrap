import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersOperationsApi = createApi({
  reducerPath: 'usersOperationsApi',
  tagTypes: ['USERS_OPERATIONS'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fftopup.store/Flexy/getusersoperations.php?action=get_operations',
  }),
  endpoints: (builder) => ({
    usersOperations: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials },
      }),
      providesTags: ['USERS_OPERATIONS'],
    }),
  }),
})
export const { useUsersOperationsQuery } = usersOperationsApi
