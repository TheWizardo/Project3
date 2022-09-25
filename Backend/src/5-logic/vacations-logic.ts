import VacationModel from "../4-models/vacation-model";
import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import { IdNotFound, ValidationError } from "../4-models/client-errors";
import { v4 as uuid } from 'uuid';
import safeDelete from "../2-utils/safe-delete";
import FollowAction from "../4-models/follow-action";
import auth from "../2-utils/auth";
import config from "../2-utils/config";

async function getAllVacations(): Promise<VacationModel[]> {
    const sqlQuery = `SELECT
                        V.vacationID AS id,
                        vacationImgPath AS imageName,
                        startDate,
                        endDate,
                        vacationPrice AS price,
                        V.destinationID AS dstId,
                        destinationName AS dstName,
                        destinationDescription AS dstDescription,
                        COUNT(F.userID) AS following
                      FROM vacations AS V
                      JOIN destinations AS D ON D.destinationID = V.destinationID
                      LEFT JOIN followers AS F ON V.vacationID = F.vacationID
                      GROUP BY V.vacationID`;
    const vacations = await dal.execute(sqlQuery);
    return vacations;
}

async function getVacationById(id: number): Promise<VacationModel> {
    const sqlQuery = `SELECT
                        V.vacationID AS id,
                        vacationImgPath AS imageName,
                        startDate,
                        endDate,
                        vacationPrice AS price,
                        V.destinationID AS dstId,
                        destinationName AS dstName,
                        destinationDescription AS dstDescription,
                        COUNT(F.userID) AS following
                      FROM vacations AS V
                      JOIN destinations AS D ON D.destinationID = V.destinationID
                      LEFT JOIN followers AS F ON V.vacationID = F.vacationID
                      WHERE V.vacationID = ?
                      GROUP BY V.vacationID`;
    const vacations = await dal.execute(sqlQuery, id);
    // making sure a vacation was returned
    if (vacations.length < 1) {
        throw new IdNotFound(id);
    }
    return vacations[0];
}

async function getVacationsByUser(authHeader: string): Promise<VacationModel[]> {
    // getting the user from the provided Token
    const userId = await auth.getUserIDFromToken(authHeader);
    const sqlQuery = `SELECT 
                        V.vacationID AS id,
                        vacationImgPath AS imageName,
                        startDate,
                        endDate,
                        vacationPrice AS price,
                        V.destinationID AS dstId,
                        destinationName AS dstName,
                        destinationDescription AS dstDescription,
                        COUNT(F.userID) AS following
                      FROM vacations AS V
                      JOIN destinations AS D ON V.destinationID = D.destinationID
                      LEFT JOIN followers AS F ON V.vacationID = F.vacationID
                      WHERE F.userID = ?
                      GROUP BY V.vacationID`;
    const vacations = await dal.execute(sqlQuery, userId);
    return vacations;
}

async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    // validating the provided vacation
    const err = vacation.validate();
    if (err) {
        throw new ValidationError(err);
    }
    // adding the new image
    await AddAndReplaceImage(vacation);
    // insert new vacation into DB
    const sqlQuery = `INSERT INTO vacations(startDate, endDate, vacationPrice, vacationImgPath, destinationID)
    VALUES(?, ?, ?, ?, ?)`;
    const result: OkPacket = await dal.execute(sqlQuery, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName, vacation.dstId);
    // updating the vacation object with the returned data
    vacation.id = result.insertId;
    vacation.following = 0;
    return vacation;
}

async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
    const err = vacation.validate();
    if (err) {
        throw new ValidationError(err);
    }
    // check if there is an image to update. if not, keep the old
    if (vacation.image) { 
        await AddAndReplaceImage(vacation);
    }

    // updating the vacation in the DB
    const sqlQuery = `UPDATE vacations SET
                        vacationImgPath = ?,
                        startDate = ?,
                        endDate = ?,
                        vacationPrice = ?,
                        destinationID = ?
                      WHERE vacationID = ?`;
    const result: OkPacket = await dal.execute(sqlQuery, vacation.imageName, vacation.startDate, vacation.endDate, vacation.price, vacation.dstId, vacation.id);
    // making sure the update was registered
    if (result.affectedRows === 0) {
        throw new IdNotFound(vacation.id);
    }
    return vacation;
}

async function deleteVacation(id: number): Promise<void> {
    // deleting the image
    AddAndReplaceImage(null, id);
    // deleting vacation from the DB
    const sqlQuery = `DELETE FROM vacations WHERE vacationID = ?`;
    const result: OkPacket = await dal.execute(sqlQuery, id);
    // making sure the update was registered
    if (result.affectedRows === 0) {
        throw new IdNotFound(id);
    }
}

async function unfollowVacation(action: FollowAction): Promise<void> {
    // deleting the follow connection in the DB
    const sqlQuery = `DELETE FROM followers WHERE vacationID = ? AND userID = ?`;
    const result: OkPacket = await dal.execute(sqlQuery, action.vacationId, action.userId);
    // making sure the update was registered
    if (result.affectedRows === 0) {
        throw new IdNotFound(action.vacationId);
    }
}

async function followVacation(action: FollowAction): Promise<FollowAction> {
    // adding new follow connection to the DB
    const sqlQuery = `INSERT INTO followers(vacationID, userID) VALUES(?, ?)`;
    const result: OkPacket = await dal.execute(sqlQuery, action.vacationId, action.userId);
    //console.log(result);******************************************
    return action;
}

async function AddAndReplaceImage(vacation: VacationModel = null, id: number = null): Promise<void> {
    let oldImageName = "PlaceholderThatWillNeverBeAnActualName.txt";
    // getting the old image name by the id
    if (vacation?.id || id) {
        const sql4img = `SELECT vacationImgPath AS img FROM vacations WHERE vacationID = ?`;
        const results = await dal.execute(sql4img, vacation?.id || id);
        oldImageName = results[0]?.img;
    }
    // deleting the file
    await safeDelete(`${config.imagesFolder}/${oldImageName}`);
    // adding the new file to assets
    if (vacation?.image) {
        // saving the file extension
        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
        // generating a universally unique name for the file 
        vacation.imageName = uuid() + extension;
        //moving the file to assets
        await vacation.image.mv(`${config.imagesFolder}/${vacation.imageName}`);
        delete vacation.image;
    }
}

export default {
    getAllVacations,
    getVacationById,
    getVacationsByUser,
    deleteVacation,
    updateVacation,
    addVacation,
    followVacation,
    unfollowVacation
};