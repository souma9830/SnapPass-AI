export const successResponse = (res, data, message = "Success", status = 200) => {
  const correlationId = res.req?.correlationId || res.req?.id || null;
  return res.status(status).json({ success: true, message, data, correlationId });
};

export const errorResponse = (res, message = "Internal Server Error", status = 500, errors = null) => {
  const correlationId = res.req?.correlationId || res.req?.id || null;
  const body = { success: false, message, correlationId };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};

export const paginatedResponse = (res, data, total, page, limit, message = "Success") => {
  const correlationId = res.req?.correlationId || res.req?.id || null;
  return res.status(200).json({
    success: true,
    message,
    data,
    correlationId,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
