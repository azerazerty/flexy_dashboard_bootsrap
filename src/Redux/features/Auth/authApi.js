import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/adminlogin.php',
        method: 'POST',
        body: { ...credentials },
      }),
      //   prepareHeaders: (headers , {getState})=>{
      //     headers
      //   },
    }),
  }),
})
export const { useLoginMutation } = authApi
