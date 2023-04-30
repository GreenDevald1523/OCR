import { useEffect, useMemo } from 'react';
import {
  useDeleteSchemeMutation,
  // useAddNewSchemeMutation,
  useGetAllSchemesIdsQuery,
  useGetSuperSchemesQuery,
} from 'store/api/document';
import {
  Fields,
  OcrSchemeOptions,
  SchemeOptions,
} from 'store/api/document/types';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectCurrentTypeName,
  setCurrentTypeId,
} from 'store/slices/currentType';

export const useModalTypesAndFields = () => {
  const allSchemesIds = useGetAllSchemesIdsQuery().data;
  const schemesFields = useGetSuperSchemesQuery(allSchemesIds || []);
  const dispatch = useTypedDispatch();
  const chosenTypeName = useTypedSelector(selectCurrentTypeName);

  const optionsWithAllSchemes = useMemo(() => {
    const finalSchemesArr: SchemeOptions[] = [
      {
        id: 0,
        value: 'Создать новый тип',
        label: 'Создать новый тип',
        fields: {
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
        createNewType: true,
      },
    ];
    [...Object.values(schemesFields.data?.schemes || {})].forEach((scheme) => {
      return finalSchemesArr.unshift({
        id: scheme.id,
        fields: scheme.fields,
        value: scheme.title,
        label: scheme.title,
      });
    });
    return finalSchemesArr;
  }, [schemesFields.data?.schemes]);

  const optionsWithOcrSchemes = useMemo(() => {
    const finalSchemesOcrArr: OcrSchemeOptions[] = [];
    [...Object.values(schemesFields.data?.schemes || {})].forEach((scheme) => {
      return (
        scheme.ocr_available &&
        finalSchemesOcrArr.unshift({
          id: scheme.id,
          fields: scheme.fields,
          value: scheme.title,
          label: scheme.title,
          ocr_available: scheme.ocr_available,
        })
      );
    });
    return finalSchemesOcrArr;
  }, [schemesFields.data?.schemes]);

  useEffect(() => {
    optionsWithAllSchemes.forEach((scheme) => {
      if (scheme.label === chosenTypeName) {
        dispatch(setCurrentTypeId(scheme.id || 0));
      }
    });
  }, [chosenTypeName, dispatch, optionsWithAllSchemes]);

  return {
    schemesIds: allSchemesIds,
    schemesAll: optionsWithAllSchemes,
    schemesOcr: optionsWithOcrSchemes,
  };
};
