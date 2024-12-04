import type { Session } from '@prisma/client';

export type PublicSessionDTO = Omit<Session, 'id' | 'userId'>;
