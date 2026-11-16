import { useEffect, useRef, useState } from 'react';
import { useCreateUpload } from '../api/storage.mutation';
import type { MimeType } from '@/constants/mimetype.constant';
import { toast } from 'sonner';

function useUpload({
  mimeTypes,
  maxSize,
}: {
  mimeTypes: MimeType[];
  maxSize: number; // mb
}) {
  const createUpload = useCreateUpload();

  const [isLoading, setIsLoading] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<string | null>(null);

  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const select = (f: File) => {
    if (!mimeTypes.includes(f.type as MimeType)) {
      toast.error('Invalid file type');
      return false;
    }
    if (f.size > maxSize * 1024 * 1024) {
      toast.error(`Max size ${maxSize} MB`);
      return false;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(f);
    setPreview(previewRef.current);
    setFile(f);
    return true;
  };

  const submit = async (target?: File): Promise<string | null> => {
    if (target && !select(target)) return null;
    const f = target ?? file;
    if (!f) return null;
    setIsLoading(true);

    try {
      const {
        data: {
          data: { url, fields },
        },
      } = await createUpload.mutateAsync({
        mimeType: f.type,
        size: f.size,
      });

      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', f); // must be last

      const res = await fetch(url, { method: 'POST', body: form });
      if (!res.ok) {
        toast.error(res.statusText);
        return null;
      }

      return fields.key;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
    setFile(null);
  };

  return { isLoading, file, preview, select, submit, reset };
}

export { useUpload };
