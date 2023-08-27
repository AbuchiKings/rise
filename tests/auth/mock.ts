//import UserController from "../../src/contoller/UserController";
import { JsonWebTokenError } from "jsonwebtoken";
import { JwtPayload } from "../../src/middleware/auth";
export const ACCESS_TOKEN = 'randomaccess';
export const accessTokenKey = 'hjdydtr';
export const USER_ID = 3;
export const USER_EMAIL = 'mytest@email.com';

//export const mockTestMethodSpy = jest.spyOn(new UserController(), 'test');

export const mockJwtValidate = jest.fn(
    async (token: string): Promise<JwtPayload> => {
        if (token === ACCESS_TOKEN) {
            return {
                aud: 'access',
                key: accessTokenKey,
                iss: 'issuer',
                iat: 1,
                exp: 2,
                sub: USER_ID,
                email: USER_EMAIL
            } as JwtPayload;
        }
        throw new JsonWebTokenError(`Bad Token`);
    },
);

export const mockRedisGet = jest.fn(
    async (key: string): Promise<string | undefined> => {
        if (key === `${USER_ID}:${accessTokenKey}`)
            return JSON.stringify({ id: USER_ID, email: USER_EMAIL });
        return;
    }
);

export const getAccessTokenMock = jest.fn(
    async (key: string): Promise<string | undefined> => {
        if (key === `${USER_ID}:${accessTokenKey}`)
            return JSON.stringify({ id: USER_ID, email: USER_EMAIL });
        return;
    }
);


jest.mock('../../src/utils/cache', () => ({
    get rdGet() {
        return mockRedisGet;
    },
}));

jest.mock('../../src/middleware/auth', () => {
    return {
       // __esModule: true,
        validate: mockJwtValidate
    }
});


export const addHeaders = (request: any) =>
    request.set('Content-Type', 'application/json').timeout(4000);

export const addAuthHeaders = (request: any, accessToken = ACCESS_TOKEN) =>
    request
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .timeout(4000);

        