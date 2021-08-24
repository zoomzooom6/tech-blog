const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
});

//GET /api/users/:id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
});

//POST /api/users
router.post('/', (req, res) => {
    //expects username and password
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
});

//POST /api/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(async dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with this username.' });
            return;
        }
    
        const validPassword = await dbUserData.comparePassword(req.body.password);
        if (!validPassword) {
            res.status(404).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({ user: dbUserData,  message: 'You are now logged in!' });
    })
});

//POST /api/logout
router.post('/logout', (req, res) => {

});

//PUT /api/users/:id
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
});

//DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;