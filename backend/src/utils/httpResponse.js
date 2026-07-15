export const successResponse = (res, data, message = "Success", status = 200) => {
    return res.status(status).json({ success: true, message, data });
};

export const errorResponse = (res, message = "Internal Server Error", status = 500, errors = null) => {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(status).json(body);
};

export const paginatedResponse = (res, data, total, page, limit, message = "Success") => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};
