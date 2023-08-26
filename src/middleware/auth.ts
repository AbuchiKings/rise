import { promisify } from 'util';

import { sign, verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import asyncHandler from '../utils/asyncHandler';
import { InternalError, AuthFailureError, BadTokenError, TokenExpiredError } from '../utils/requestUtils/ApiError';
import { ProtectedRequest, UserInterface } from '../utils/interfaces/interface'
import { rdGet } from '../utils/cache'

const SECRET = process.env.JWT_KEY;

export default class JWT {
    public static async signToken(payload: JwtPayload): Promise<string> {
        // @ts-ignore
        return promisify(sign)({ ...payload }, SECRET);
    }

    public static async validate(token: string): Promise<JwtPayload> {
        // @ts-ignore
        return (await promisify(verify)(token, SECRET)) as JwtPayload;
    }
}

export class JwtPayload {
    aud: string;
    key?: string;
    iss?: string;
    iat?: number;
    exp?: number;
    sub?: number;
    email: string


    constructor(sub: number, key: string, email: string) {
        this.iss = 'issuer';
        this.aud = 'access';
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + 3 * 24 * 60 * 60;
        this.email = email
        this.key = key
        this.sub = sub
    }
}

export const createToken = async (
    user: UserInterface, accessTokenKey: string
): Promise<string> => {
    const accessToken = await JWT.signToken(
        new JwtPayload(
            user.id,
            accessTokenKey,
            user.email || ''
        ),
    );

    if (!accessToken) throw new InternalError();
    return accessToken
};

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError('Invalid Authorization');
    if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
    return authorization.split(' ')[1];
};


export const verifyToken = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
        req.accessToken = getAccessToken(req.headers.authorization); 

        const payload = await JWT.validate(req.accessToken);
        if (!payload.sub || !payload.key) throw new BadTokenError()

        const user = await rdGet(`${payload.sub}:${payload.key}`)
        if (!user) throw new AuthFailureError('User not registered');

        return next();
    } catch (e: any) {
        if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
            e.message = 'Unauthorised. Please login with your details';
        }
        return next(e);
    }
}