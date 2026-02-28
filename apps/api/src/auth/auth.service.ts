import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            companyId: user.companyId
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                companyId: user.companyId,
            }
        };
    }

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }
    async onboarding(data: any) {
        const { companyName, email, password, name } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: { name: companyName },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'COMPANY_ADMIN',
                    companyId: company.id,
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...userResult } = user;
            return {
                company,
                user: userResult,
                access_token: this.jwtService.sign({
                    email: user.email,
                    sub: user.id,
                    role: user.role,
                    companyId: user.companyId
                })
            };
        });
    }
}
