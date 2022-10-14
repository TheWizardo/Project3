import VacationModel from "../4-models/vacation-model";
import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import { IdNotFound, ValidationError } from "../4-models/client-errors";
import { v4 as uuid } from 'uuid';
import safeDelete from "../2-utils/safe-delete";
import auth from "../2-utils/auth";
import config from "../2-utils/config";

async function getAllVacations(authHeader: string): Promise<VacationModel[]> {
    // getting the user from the provided Token
    const uId = auth.getUserIDFromToken(authHeader);
    const sqlQuery = `SELECT DISTINCT
                        V.vacationID AS id,
                        vacationImgPath AS imageName,
                        startDate,
                        endDate,
                        vacationPrice AS price,
                        V.destinationID AS dstId,
                        destinationName AS dstName,
                        destinationDescription AS dstDescription,
                        EXISTS(SELECT * FROM followers WHERE vacationID = F.vacationID AND userID = ?) AS isFollowed,
                        COUNT(F.userID) AS followersCount
                      FROM vacations AS V
                      JOIN destinations AS D ON D.destinationID = V.destinationID
                      LEFT JOIN followers AS F ON V.vacationID = F.vacationID
                      GROUP BY V.vacationID`;
    const vacations = await dal.execute(sqlQuery, uId);
    vacations.map(v => v.isFollowed = v.isFollowed ? true : false);
    return vacations;
}

async function getVacationById(authHeader: string, vId: number): Promise<VacationModel> {
    // getting the user from the provided Token
    const uId = auth.getUserIDFromToken(authHeader);
    const sqlQuery = `SELECT DISTINCT
                        V.vacationID AS id,
                        vacationImgPath AS imageName,
                        startDate,
                        endDate,
                        vacationPrice AS price,
                        V.destinationID AS dstId,
                        destinationName AS dstName,
                        destinationDescription AS dstDescription,
                        EXISTS(SELECT * FROM followers WHERE vacationID = F.vacationID AND userID = ?) AS isFollowed,
                        COUNT(F.userID) AS followersCount
                      FROM vacations AS V
                      JOIN destinations AS D ON D.destinationID = V.destinationID
                      LEFT JOIN followers AS F ON V.vacationID = F.vacationID
                      WHERE V.vacationID = ?
                      GROUP BY V.vacationID`;
    const vacations = await dal.execute(sqlQuery, uId, vId);
    // making sure a vacation was returned
    if (vacations.length < 1) {
        throw new IdNotFound(vId);
    }
    const vacation = vacations[0];
    vacation.isFollowed = vacation.isFollowed ? true : false;
    return vacation;
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
    const result: OkPacket = await dal.execute(sqlQuery, parseDate(vacation.startDate), parseDate(vacation.endDate), vacation.price, vacation.imageName, vacation.dstId);
    // updating the vacation object with the returned data
    vacation.id = result.insertId;
    vacation.followersCount = 0;
    vacation.isFollowed = false;
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
    const result: OkPacket = await dal.execute(sqlQuery, vacation.imageName, parseDate(vacation.startDate), parseDate(vacation.endDate), vacation.price, vacation.dstId, vacation.id);
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

async function unfollowVacation(vId: number, uId: number): Promise<void> {
    // deleting the follow connection in the DB
    const sqlQuery = `DELETE FROM followers WHERE vacationID = ? AND userID = ?`;
    const result: OkPacket = await dal.execute(sqlQuery, vId, uId);
    // making sure the update was registered
    if (result.affectedRows === 0) {
        throw new IdNotFound(vId);
    }
}

async function followVacation(vId: number, uId: number): Promise<number> {
    // adding new follow connection to the DB
    const sqlQuery = `INSERT INTO followers(vacationID, userID) VALUES(?, ?)`;
    const result: OkPacket = await dal.execute(sqlQuery, vId, uId);
    return vId;
}

async function AddAndReplaceImage(vacation?: VacationModel, id?: number): Promise<void> {
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

function parseDate(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export default {
    getAllVacations,
    getVacationById,
    // getVacationsByUser,
    deleteVacation,
    updateVacation,
    addVacation,
    followVacation,
    unfollowVacation
};