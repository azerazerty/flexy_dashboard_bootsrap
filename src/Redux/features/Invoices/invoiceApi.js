import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  tagTypes: ['INVOICES'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fftopup.store/Flexy/getinvoices.php' }),
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, action: 'get_invoices' },
      }),
      providesTags: ['INVOICES'],
    }),
    deleteInvoice: builder.mutation({
      query: ({ credentials, Invoice }) => ({
        url: '',
        method: 'POST',
        body: { ...credentials, invoice_id: Invoice.id, action: 'delete_invoice' },
      }),
      invalidatesTags: ['INVOICES'],
    }),
  }),
})
export const { useGetInvoicesQuery, useDeleteInvoiceMutation } = invoiceApi
