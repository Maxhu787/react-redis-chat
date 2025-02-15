const handleLogin = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({
      loggedIn: true,
      username: req.session.user.username,
      userid: req.session.user.userid,
    });
  } else {
    res.json({ loggedIn: false });
  }
};

module.exports = handleLogin;
