import {
  sendS2SRequest,
  throwForbiddenError,
} from 'app/api/request'

type Params = {
  authId: string;
}

export async function GET (
  request: Request, context: { params: Params },
) {
  const authId = context.params.authId

  return sendS2SRequest({
    method: 'GET',
    uri: `/api/v1/users/${authId}`,
  })
}

export async function POST (
  request: Request, context: { params: Params },
) {
  const authId = context.params.authId

  const reqBody = await request.json()
  if (!reqBody || !reqBody.action) return throwForbiddenError()

  return sendS2SRequest({
    method: 'POST',
    uri: `/api/v1/users/${authId}/${reqBody.action}`,
  })
}

export async function PUT (
  request: Request, context: { params: Params },
) {
  const authId = context.params.authId

  const reqBody = await request.json()
  if (!reqBody) return throwForbiddenError()

  return sendS2SRequest({
    method: 'PUT',
    uri: reqBody.action ? `/api/v1/users/${authId}/${reqBody.action}` : `/api/v1/users/${authId}`,
    body: JSON.stringify(reqBody.data),
  })
}

export async function DELETE (
  request: Request, context: { params: Params },
) {
  const authId = context.params.authId

  return sendS2SRequest({
    method: 'DELETE',
    uri: `/api/v1/users/${authId}`,
  })
}
