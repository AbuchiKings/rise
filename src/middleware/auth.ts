import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from '../utils/requestUtils/ApiError';
import { UserInterface } from '../utils/interfaces/interface'

const SECRET = process.env.JWT_KEY;

export default class JWT {
    public static async signToken(payload: JwtPayload): Promise<string> {
        // @ts-ignore
        return promisify(sign)({ ...payload }, SECRET, { expiresIn: '12h' });
    }

    public static async verifyToken(token: string): Promise<JwtPayload> {
        try {
            // @ts-ignore
            return (await promisify(verify)(token, SECRET)) as JwtPayload;
        } catch (e: any) {
            if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError();
            throw new BadTokenError();
        }
    }
}

export class JwtPayload {
    aud: string;
    sub?: string;
    iss?: string;
    iat?: number;
    exp?: number;
    name?: string

    constructor(subject: string, name: string) {
        this.iss = 'issuer';
        this.aud = 'access';
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + 7 * 24 * 60 * 60;
        this.sub = subject;
        this.name = name
    }
}

export const createTokens = async (
    user: UserInterface,
): Promise<string> => {
    const accessToken = await JWT.signToken(
        new JwtPayload(
            `${user.id}`,
            user.name
        ),
    );

    if (!accessToken) throw new InternalError();
    return accessToken
};