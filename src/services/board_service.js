const Board = require("../models/board");
const statusOrder = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

async function addBoard(boardData) {
    const board = new Board(boardData);
    return await board.save();
}

async function getBoard(filter) {
    const boards = await Board.find(filter);

    const groupedByStatus = statusOrder.reduce((result, status) => {
        const cardsForStatus = boards
            .filter(board => board.status === status)
            .map(board => ({
                id: board._id,
                title: board.title,
                description: board.description
            }));

        result.push({
            id: result.length + 1,
            status,
            cards: cardsForStatus
        });

        return result;
    }, []);

    res.json(groupedByStatus);
}

async function changeCardStatus(filter) {
    const {card_id, new_status} = filter;
    const updatedCard = await Board.findByIdAndUpdate(
        card_id,
        {$set: {status: new_status}},
        {new: true}
    );

    if (!updatedCard) {
        return res.status(404).json({message: "Card not found"});
    }
}


module.exports =  {
    addBoard,
    getBoard,
    changeCardStatus
}