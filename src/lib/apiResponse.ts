// 공통 응답 형식 정의
export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const createdResponse = (data: any, message = "Resource created") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (statusCode: number, message: string) => ({
  success: false,
  statusCode,
  message,
});
