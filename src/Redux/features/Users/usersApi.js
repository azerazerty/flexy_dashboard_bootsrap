import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['USERS'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/manageusers.php' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, action: 'get_users' },
      }),
      providesTags: ['USERS'],
    }),
    searchUsers: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...User, action: 'get_users' },
      }),
    }),
    createUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...User, action: 'create_user' },
      }),
      invalidatesTags: ['USERS'],
    }),
    editUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '/manageusers.php',
        method: 'POST',
        body: { ...credentials, ...User, action: 'edit_user' },
      }),
      invalidatesTags: ['USERS'],
    }),
    deleteUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, delete_username: User.delete_username, action: 'delete_user' },
      }),
      invalidatesTags: ['USERS'],
    }),
    payUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, pay_username: User.pay_username, action: 'pay_user' },
      }),
      invalidatesTags: ['USERS'],
    }),
  }),
})
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  usePayUserMutation,
  useSearchUsersMutation,
} = usersApi
