import dal from "../2-utils/dal";
import { IdNotFound, UnauthorizedError, ValidationError } from "../4-models/client-errors";
import { OkPacket } from "mysql";
import DestinationModel from "../4-models/destination-model";

async function getAllDestinations(): Promise<DestinationModel[]> {
    const sqlQuery = `SELECT destinationID AS id,
                             destinationName AS name,
                             destinationDescription AS description
                      FROM destinations`;
    const destinations = await dal.execute(sqlQuery);
    return destinations;
}

async function updateDestination(dst: DestinationModel): Promise<DestinationModel> {
    // verifying given destination
    const error = dst.validate();
    if (error) throw new ValidationError(error);

    // updating destination in the DB
    const sqlQuery = `UPDATE destinations SET
                        destinationName = ?,
                        destinationDescription = ?
                      WHERE destinationID = ?`;
    const result: OkPacket = await dal.execute(sqlQuery, dst.name, dst.description, dst.id);
    // making sure update was registered
    if (result.affectedRows === 0) {
        throw new IdNotFound(dst.id);
    }
    return dst;
}

async function addDestination(dst: DestinationModel): Promise<DestinationModel> {
    const error = dst.validate();
    if (error) throw new ValidationError(error);

    // adding the destination to the DB
    const sqlQuery = `INSERT INTO destinations(destinationName, destinationDescription)
                                  VALUES(?, ?)`;
    const result: OkPacket = await dal.execute(sqlQuery, dst.name, dst.description);
    // updating destination object
    dst.id = result.insertId;
    return dst;
}

// async function deleteDestinations(id: number): Promise<void> {
//     // removing the destination from the given 
//     const sqlQuery = `DELETE FROM destinations WHERE destinationID = ${id}`;
//     const result: OkPacket = await dal.execute(sqlQuery);
//     if (result.affectedRows === 0) {
//         throw new IdNotFound(id);
//     }
// }

export default {
    getAllDestinations,
    updateDestination,
    addDestination
    // deleteDestinations
};