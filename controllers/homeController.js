exports.getHomepage = (req, res) => {
    const user = req.session.id;
    res.render('home', { title: 'Home' ,user});
};