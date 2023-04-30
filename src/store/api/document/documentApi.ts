/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mergeSchemesFields } from '../../../utils/mergeSchemesFields';
import { baseApi } from '../baseAPI';
import { DirectoryWithInnerInfo } from '../directory/types';
import {
  CreateDocumentResponse,
  Document,
  Fields,
  OcrRequest,
  OcrResponse,
  Scheme,
  ShortDocumentFields,
  SuperSchemes,
} from './types';

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDocumentsByDirectoryId: builder.query<Document[], number | null>({
      async queryFn(_arg, _queryApi, _qxtraOptions, fetchwithBq) {
        if (!_arg) return { data: [] as Document[] };

        const directoryInfo = await fetchwithBq({
          url: `directory/${_arg}`,
        });

        const documentsId =
          (directoryInfo?.data as DirectoryWithInnerInfo)?.inner_documents_id ??
          [];

        if (documentsId.length === 0) return { data: [] };

        const finalResult = await Promise.all(
          documentsId.map(async ({ document_id }) => {
            const document = await fetchwithBq({
              url: `document/${document_id}`,
            });

            return document.data as Document;
          })
        );

        return { data: finalResult as Document[] };
      },
      providesTags: ['AllDocuments'],
    }),

    // postPDFtoIMG: builder.mutation<Blob, FormData>({
    //   query: (body) => ({
    //     url: '/scheme/pdftoimg',
    //     method: 'POST',
    //     responseHandler: (response) => new ReadableStream(response?.body),
    //     body,
    //   }),
    // }),

    getSuperSchemeBySchemesIds: builder.query<Fields, number[]>({
      async queryFn(_arg, _queryApi, _extraOptions, _fetchWithBq) {
        if (_arg.length === 0)
          return {
            data: {
              bool_field_scheme: [],
              enum_field_scheme: [],
              file_field_scheme: [],
              filelist_field_scheme: [],
              int_field_scheme: [],
              link_field_scheme: [],
              linklist_field_scheme: [],
              list_field_scheme: [],
              real_field_scheme: [],
              text_field_scheme: [],
              datetime_field_scheme: [],
              user_field_scheme: [],
              userlist_field_scheme: [],
            },
          };

        const schemesArray = await Promise.all(
          _arg.map(async (elem) => {
            const scheme = await _fetchWithBq({
              url: `/document/scheme/${elem}`,
            });
            return scheme.data as Scheme;
          })
        );

        const superSchemeFields = mergeSchemesFields(schemesArray);

        return {
          data: superSchemeFields,
        };
      },
    }),

    getSuperSchemes: builder.query<SuperSchemes, number[]>({
      async queryFn(_arg, _queryApi, _extraOptions, _fetchWithBq) {
        const schemesArray = await Promise.all(
          _arg.map(async (id) => {
            const scheme = await _fetchWithBq({
              url: `/document/scheme/${id}`,
            });
            return scheme.data as Scheme;
          })
        );

        const superSchemeFields = mergeSchemesFields(schemesArray);

        const schemesMap: Record<number, Scheme> = {};

        schemesArray.forEach((scheme, index) => {
          schemesMap[_arg[index]] = scheme;
        });

        const returnValue = {
          superFields: superSchemeFields,
          schemes: schemesMap,
        };

        return {
          data: returnValue,
        };
      },
    }),

    getAllSchemesIds: builder.query<number[], void>({
      async queryFn(arg, api, extraOptions, baseQuery) {
        const { data } = await baseQuery({
          url: '/document/scheme/all',
        });

        return { data: data as number[] };
      },
      providesTags: ['AllSchemes'],
    }),

    updateDocument: builder.mutation<
      void,
      { id: number; fields: ShortDocumentFields }
    >({
      query: ({ id, fields }) => ({
        url: `document/${id}`,
        method: 'PUT',
        body: {
          fields,
        },
      }),
      invalidatesTags: ['AllDocuments'],
    }),

    deleteDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `document/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AllDocuments', 'AllSchemes'],
    }),

    createDocument: builder.mutation<
      CreateDocumentResponse,
      Omit<
        Document,
        | 'createdate'
        | 'modifydate'
        | 'id'
        | 'creator'
        | 'deletemark'
        | 'fields'
        | 'directory'
      > & { fields: ShortDocumentFields; directory: number | null }
    >({
      query: (body) => ({
        url: '/document',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AllDocuments'],
    }),

    createScheme: builder.mutation<unknown, unknown>({
      query: (body) => ({
        url: 'document/scheme',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AllSchemes'],
    }),

    sendOcrData: builder.mutation<OcrResponse, OcrRequest>({
      query: (ocrInfo) => ({
        url: '/scheme/ocr',
        method: 'POST',
        body: { ...ocrInfo },
      }),
    }),

    sendFragment: builder.mutation<{ text: string }, FormData>({
      query: (body) => ({
        url: '/scheme/fragment',
        method: 'POST',
        body,
      }),
    }),

    deleteScheme: builder.mutation<void, number>({
      query: (schemeid) => ({
        schemeid: schemeid,
        url: `/document/scheme/${schemeid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AllSchemes', 'AllDocuments'],
    }),
  }),
});

export const {
  useGetSuperSchemesQuery,
  useGetAllDocumentsByDirectoryIdQuery,
  useGetSuperSchemeBySchemesIdsQuery,
  useGetAllSchemesIdsQuery,
  useSendOcrDataMutation,
  // usePostPDFtoIMGMutation,
  useCreateDocumentMutation,
  useCreateSchemeMutation,
  useUpdateDocumentMutation,
  useDeleteSchemeMutation,
  useDeleteDocumentMutation,
  useSendFragmentMutation,
} = documentApi;
