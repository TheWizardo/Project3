import dal from "../2-utils/dal";
import auth from "../2-utils/auth";
import { UnauthorizedError, ValidationError } from "../4-models/client-errors";
import UserModel from "../4-models/user-model";
import CredentialsModel from "../4-models/credentials-model";
import { OkPacket } from "mysql";

async function register(user: UserModel): Promise<string> {
    // make sure the user is valid
    const error = user.validate();
    if (error) throw new ValidationError(error);
    // getting the ID for the role 'User'
    const sql4roleId = `SELECT * FROM roles WHERE roleName = 'User'`;
    const roleResult = await dal.execute(sql4roleId);
    const userRoleId = roleResult[0].roleID;

    // inserting the new user to the DB
    const sqlQuery = `INSERT INTO users (userID, firstName, lastName, userRole, username, password)
                      VALUES (DEFAULT, ?, ?, ?, ?, ?)`;
    const result: OkPacket = await dal.execute(sqlQuery, user.firstName, user.lastName, userRoleId, user.username, auth.hash(user.password));
    // updating the user with the returned ID
    user.id = result.insertId;
    user.role = "User";
    delete user.password;
    // generating token
    const token = auth.generateNewToken(user);
    return token;
}

async function login(creds: CredentialsModel): Promise<string> {
    const error = creds.validate();
    if (error) throw new ValidationError(error);
    
    // getting the user by his credentials
    const sqlQuery = `SELECT
                        userID AS id,
                        firstName,
                        lastName,
                        roleName AS role,
                        username
                        FROM users AS U
                        JOIN roles AS R ON U.userRole = R.roleID
                        WHERE username = ? AND password = ?`;
    const users = await dal.execute(sqlQuery, creds.username, auth.hash(creds.password));
    if (users.length < 1) throw new UnauthorizedError("Incorrect username or password");
    const user = new UserModel(users[0]);
    // augmenting the user object
    delete user.password;
    // generating token
    const token = auth.generateNewToken(user);
    return token;
}

async function usernameExists(username: string): Promise<boolean> {
    // getting amount of users with 'username' 
    const sqlQuery = `SELECT
                        COUNT(*) AS usersWithName
                        FROM users
                        WHERE username = ?`;
    const users = await dal.execute(sqlQuery, username);
    // if there are more than 0, the username exists.
    return users[0].usersWithName > 0;
}

export default {
    register, login, usernameExists
};