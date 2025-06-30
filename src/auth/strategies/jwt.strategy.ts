import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'a0872370d427b2cbfd09d3afeed66f0f193b8288e769778d4823351b4b90ded7e17bb06f85680449e36f4bb7bba6a5badcfe31dd61b63a86f55d9ead4d2503d9',
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      userId: payload.sub, 
      email: payload.email 
    };
  }
} 