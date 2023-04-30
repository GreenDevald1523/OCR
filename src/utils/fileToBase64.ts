export const fileToBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result
        ?.toString()
        .replace(/^data:(.*,)?/, '') as string;
      const encodedLength = encoded.length % 4;
      if (encodedLength > 0) {
        encoded += '='.repeat(4 - encodedLength);
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
