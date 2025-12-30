export type ApiResponse<T> = {
  isSuccess: boolean;
  error?: {
    code: string;
    description: string;
  };
  data?: T | null;
};
