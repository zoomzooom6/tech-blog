const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all posts /api/posts/
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => res.status(500).json(err));
});

//GET 1 post /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'created_at', 'contents'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(500).json(err));
});

//POST /api/posts
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        contents: req.body.contents,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => res.status(400).json(err));
});

//PUT /api/posts/:id
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(400).json(err));
});

//DELETE /api/posts/:id
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(400).json(err));
})

module.exports = router;