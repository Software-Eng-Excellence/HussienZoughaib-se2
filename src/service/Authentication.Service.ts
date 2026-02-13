import jwt from 'jsonwebtoken';
import  config  from '../config';
import { TokenPayload } from '../config/tokenPayload';
import { AuthenticationException, ExpiredTokenException, InvalidTokenException } from '../util/exceptions/http/AuthenticationException';
import { Response } from 'express';
import logger from '../util/logger';
import ms from 'ms';
import { ServiceException } from '../util/exceptions/ServiceException';
export class AuthenticationService {
    constructor(
        private seceret=config.auth.jwtSecret,
        private expiration=config.auth.expiration,
        private refreshExpiration=config.auth.refreshExpiration
    ){}
     generateToken(userId:string):string{
        return jwt.sign({userId},this.seceret,{expiresIn:this.expiration});
    }
    generateRefreshToken(userId:string):string{
        return jwt.sign({userId},this.seceret,{expiresIn:this.refreshExpiration});
    }
    

     verifyToken(token:string):TokenPayload{
        try {
            return jwt.verify(token,this.seceret) as TokenPayload;
        } catch (error) {
            logger.error("Token verification failed", { error });
            if (error instanceof jwt.TokenExpiredError) {
                throw new ExpiredTokenException();
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }

            throw new ServiceException("An error occurred during token verification");
        }
}
refreshToken(refreshToken:string){
 const payload=this.verifyToken(refreshToken);
 if(!payload){
    throw new InvalidTokenException();
}
 const newToken=this.generateToken(payload.userId);
    return newToken;
}

setTokenInCookie(res:Response,token:string){
    res.cookie('auth_token',token,{
        httpOnly:true,
        secure:config.isProduction,
    
        maxAge:ms(this.expiration)
    });


}
setRefreshTokenInCookie(res:Response,refreshToken:string){
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:config.isProduction,
        maxAge:ms(this.refreshExpiration)
    });
}

clearTokens(res:Response){
    res.clearCookie('auth_token');
    res.clearCookie('refreshToken');

}
persisAuthentication(res:Response,userId:string){
     const token=  this.generateToken(userId);
        const refreshToken=this.generateRefreshToken(userId);
       
         this.setTokenInCookie(res,token);
           this.setRefreshTokenInCookie(res,refreshToken);
         
}

}