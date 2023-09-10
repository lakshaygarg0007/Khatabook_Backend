const Board = require("../models/board");
const {ObjectId} = require("mongodb");
const boardService = require("../services/board_service");
app.post('/addBoard', jsonParser, async function (req, res) {
    try {
        await boardService.addBoard(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Board Event');
    }
});

app.post('/deleteBoard', jsonParser, async function (req, res) {
    try {
        const id = new ObjectId(req.body.boardId)
        await Board.deleteOne({_id: id});
        res.send('Record Deleted Successfully');
    } catch (error) {
        res.send('Error While Deleting Calendar Event');
    }
});

app.post('/getBoard', jsonParser, async function (req, res) {
    const filter = {user_id: req.body.user_id};
    try {
        const board = await boardService.getBoard(filter);
        res.send(board);
    } catch (error) {
        res.status(500).send('Error fetching Board Data');
    }
});


app.post('/changeCardStatus', jsonParser, async (req, res) => {
    try {
        await boardService.changeCardStatus(req.body)
        res.json({message: "Card status updated successfully"});
    } catch (error) {
        res.status(500).json({message: "An error occurred while updating card status"});
    }
});
