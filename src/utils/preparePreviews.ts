import { FileWithPath } from '@mantine/dropzone';

export const preparePrewiews = (files: FileWithPath[]) => {
  return Promise.all(
    files.map(async (file) => {
      switch (file.type) {
        case 'application/pdf':
          const fd = new FormData();
          fd.append('pdf', file);

          const pdfUrl = await fetch(
            import.meta.env.VITE_API_URL + '/scheme/pdftoimg',
            {
              method: 'POST',
              body: fd,
              credentials: 'include',
            }
          ).then(async (res) => {
            if (!res.body) return '';
            const url = URL.createObjectURL(await res.blob());
            return url;
          });

          return pdfUrl;
        default:
          const imageUrl = URL.createObjectURL(file);
          return imageUrl;
      }
    })
  );
};
