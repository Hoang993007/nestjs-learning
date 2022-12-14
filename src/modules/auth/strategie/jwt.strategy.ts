import { UsersService } from './../../users/users.service';
import { strategyName } from './../../../shares/constants/constants';
import { AUTH_SECRET } from '../../../shares/constants/env.constants';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, strategyName.USER_JWT) {
  constructor(
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_SECRET,
    });
  }

  async validate(payload: AuthJwtPayload): Promise<any> {
    const user = await this.userService.findUserById(payload.sub);
    if(!user) {
      throw new HttpException(
        'Invalid jwt token',
        HttpStatus.UNAUTHORIZED
      );
    }

    return user;
  }
}
