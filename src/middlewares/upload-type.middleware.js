export const setUploadType = (uploadType) => {
    return (req, res, next) => {
        req.uploadType = uploadType;
        next();
    };
};