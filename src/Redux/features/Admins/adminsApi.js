import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminsApi = createApi({
  reducerPath: 'adminsApi',
  tagTypes: ['ADMINS'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/manageadmins.php' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, action: 'get_users' },
      }),
      providesTags: ['ADMINS'],
    }),
    createUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...User, action: 'create_user' },
      }),
      invalidatesTags: ['ADMINS'],
    }),
    editUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, ...User, action: 'edit_user' },
      }),
      invalidatesTags: ['ADMINS'],
    }),
    deleteUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, delete_username: User.delete_username, action: 'delete_user' },
      }),
      invalidatesTags: ['ADMINS'],
    }),
    payUser: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, pay_username: User.pay_username, action: 'pay_user' },
      }),
      invalidatesTags: ['ADMINS'],
    }),
    generateApi: builder.mutation({
      query: ({ credentials, User }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, edit_username: User.edit_username, action: 'update_apikey' },
      }),
      invalidatesTags: ['ADMINS', 'HOME'],
    }),
  }),
})
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  usePayUserMutation,
  useGenerateApiMutation
} = adminsApi
