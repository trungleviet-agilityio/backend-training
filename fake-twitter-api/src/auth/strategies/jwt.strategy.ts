import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/database/entities/user.entity';
import { UserInfoDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Constructor
   *
   * @param configService - Config service
   * @param userRepository - User repository
   */
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(
    payload: IJwtPayload,
  ): Promise<IJwtPayload & { user: UserInfoDto }> {
    /**
     * Validate
     *
     * @param payload - Jwt payload
     * @returns User object with JWT payload
     */

    const user = await this.userRepository.findOne({
      where: { uuid: payload.sub },
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return user object with JWT payload
    return {
      ...payload,
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          name: user.role.name,
        },
      },
    };
  }
}
