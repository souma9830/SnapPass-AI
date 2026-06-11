export const successResponse = (res, data, message = "Success", status = 200) => {
    return res.status(status).json({ success: true, message, data });
};

// Paginated response wrapper support
export const sendPaginatedResponse = (res, data, page, limit) => res.json(data);
