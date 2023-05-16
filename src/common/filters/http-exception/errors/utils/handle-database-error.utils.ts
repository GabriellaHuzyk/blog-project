import { DatabaseError } from '../types/database-error';
import { PrismaClientError } from '../types/prisma-client-error';
import { UniqueConstanteError } from '../types/unique-constraint-error';

enum PrismaErrors {
  UniqueContraintFail = 'P1002',
}

export const handleDatabaseErrors = (e: PrismaClientError): Error => {
  switch (e.code) {
    case PrismaErrors.UniqueContraintFail:
      return new UniqueConstanteError(e);

    default:
      return new DatabaseError(e.message);
  }
};
