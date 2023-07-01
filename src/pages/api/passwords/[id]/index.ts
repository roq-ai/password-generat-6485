import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { passwordValidationSchema } from 'validationSchema/passwords';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.password
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPasswordById();
    case 'PUT':
      return updatePasswordById();
    case 'DELETE':
      return deletePasswordById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPasswordById() {
    const data = await prisma.password.findFirst(convertQueryToPrismaUtil(req.query, 'password'));
    return res.status(200).json(data);
  }

  async function updatePasswordById() {
    await passwordValidationSchema.validate(req.body);
    const data = await prisma.password.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePasswordById() {
    const data = await prisma.password.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
