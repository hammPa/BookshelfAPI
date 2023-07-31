const { addBook, displayBooks, displayBookById, editBook, deleteBook } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: displayBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: displayBookById,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBook,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook,
    },
];

module.exports = routes;