module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to view this page.'
    });
};
