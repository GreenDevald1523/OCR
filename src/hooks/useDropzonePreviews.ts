import { useState, useEffect } from 'react';

import { FileWithPath } from '@mantine/dropzone';

import { preparePrewiews } from 'utils/preparePreviews';

export const useDropzonePreviews = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    preparePrewiews(files).then((previews) => setPreviewUrls(previews));
  }, [files]);

  return {
    files,
    setFiles,
    previewUrls,
  };
};
