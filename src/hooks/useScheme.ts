import {
  useGetAllSchemesIdsQuery,
  useGetSuperSchemesQuery,
} from 'store/api/document';

export const useScheme = (id: number) => {
  const allSchemesIds = useGetAllSchemesIdsQuery();

  const allSchemes = useGetSuperSchemesQuery(allSchemesIds?.data || []);

  const result = allSchemes?.data?.schemes[id] || null;

  return result;
};
