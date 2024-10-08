'use client'

import { useAuth } from '@melody-auth/react'
import {
  Button,
  Table,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
  useCallback,
  useEffect, useMemo, useState,
} from 'react'
import {
  EyeIcon, EyeSlashIcon,
} from '@heroicons/react/16/solid'
import RedirectUriEditor from '../RedirectUriEditor'
import useEditApp from '../useEditApp'
import {
  proxyTool, routeTool, typeTool,
} from 'tools'
import PageTitle from 'components/PageTitle'
import ClientTypeLabel from 'components/ClientTypeLabel'
import SubmitError from 'components/SubmitError'
import FieldError from 'components/FieldError'
import ScopesEditor from 'components/ScopesEditor'
import SaveButton from 'components/SaveButton'
import DeleteButton from 'components/DeleteButton'
import useLocaleRouter from 'hooks/useLocaleRoute'

const Page = () => {
  const { id } = useParams()
  const router = useLocaleRouter()

  const t = useTranslations()

  const [app, setApp] = useState()
  const { acquireToken } = useAuth()

  const [scopes, setScopes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const availableScopes = useMemo(
    () => scopes.filter((scope) => scope.type === app?.type),
    [app?.type, scopes],
  )

  const {
    values, errors, onChange,
  } = useEditApp(app)

  const updateObj = useMemo(
    () => {
      if (!app) return {}
      const updateKeys = ['name', 'scopes', 'redirectUris', 'isActive'].filter((key) => values[key] !== app[key])
      return updateKeys.reduce(
        (
          obj, key,
        ) => ({
          ...obj,
          [key]: values[key],
        }),
        {},
      )
    },
    [app, values],
  )

  const getApp = useCallback(
    async () => {
      const token = await acquireToken()
      const data = await proxyTool.sendNextRequest({
        endpoint: `/api/apps/${id}`,
        method: 'GET',
        token,
      })
      setApp(data.app)
    },
    [acquireToken, id],
  )

  const toggleSecret = () => {
    setShowSecret(!showSecret)
  }

  const handleDelete = async () => {
    const token = await acquireToken()
    setIsLoading(true)
    await proxyTool.sendNextRequest({
      endpoint: `/api/apps/${id}`,
      method: 'DELETE',
      token,
    })
    router.push(routeTool.Internal.Apps)
    setIsLoading(false)
  }

  useEffect(
    () => {
      const getScopes = async () => {
        const token = await acquireToken()
        const data = await proxyTool.getScopes(token)
        setScopes(data.scopes)
      }

      getApp()
      getScopes()
    },
    [getApp, acquireToken],
  )

  const handleSave = async () => {
    if (Object.values(errors).some((val) => !!val)) {
      return
    }

    const token = await acquireToken()
    setIsLoading(true)
    const result = await proxyTool.sendNextRequest({
      endpoint: `/api/apps/${id}`,
      method: 'PUT',
      token,
      body: { data: updateObj },
    })
    setIsLoading(false)
    if (result) await getApp()
  }

  const handleToggleAppScope = (scope: string) => {
    const newScopes = values.scopes.includes(scope)
      ? values.scopes.filter((currentScope) => currentScope !== scope)
      : [...values.scopes, scope]
    onChange(
      'scopes',
      newScopes,
    )
  }

  if (!app) return null

  return (
    <section>
      <PageTitle
        className='mb-6'
        title={t('apps.app')}
      />
      <section>
        <Table>
          <Table.Head>
            <Table.HeadCell className='max-md:w-24 md:w-48'>{t('common.property')}</Table.HeadCell>
            <Table.HeadCell>{t('common.value')}</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y break-all'>
            <Table.Row>
              <Table.Cell>{t('apps.name')}</Table.Cell>
              <Table.Cell>
                <TextInput
                  onChange={(e) => onChange(
                    'name',
                    e.target.value,
                  )}
                  value={values.name}
                />
                <FieldError error={errors.name} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('apps.clientId')}</Table.Cell>
              <Table.Cell>{app.clientId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('apps.clientSecret')}</Table.Cell>
              <Table.Cell className='break-all'>
                <div className='flex items-center gap-4'>
                  {showSecret ? app.secret : '*****'}
                  <Button
                    size='xs'
                    color='light'
                    onClick={toggleSecret}>
                    {showSecret ? <EyeSlashIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />}
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('apps.status')}</Table.Cell>
              <Table.Cell>
                <ToggleSwitch
                  checked={values.isActive}
                  onChange={() => onChange(
                    'isActive',
                    !values.isActive,
                  )}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('apps.type')}</Table.Cell>
              <Table.Cell>
                <ClientTypeLabel type={app.type} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('apps.scopes')}</Table.Cell>
              <Table.Cell>
                <ScopesEditor
                  scopes={availableScopes}
                  value={values.scopes}
                  onToggleScope={handleToggleAppScope}
                />
              </Table.Cell>
            </Table.Row>
            {app.type === typeTool.ClientType.SPA && (
              <Table.Row>
                <Table.Cell>{t('apps.redirectUris')}</Table.Cell>
                <Table.Cell>
                  <RedirectUriEditor
                    redirectUris={values.redirectUris}
                    onChange={(uris) => onChange(
                      'redirectUris',
                      uris,
                    )}
                  />
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell>{t('common.createdAt')}</Table.Cell>
              <Table.Cell>{app.createdAt} UTC</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('common.updatedAt')}</Table.Cell>
              <Table.Cell>{app.updatedAt} UTC</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>
      <SubmitError />
      <section className='flex items-center gap-4 mt-8'>
        <SaveButton
          isLoading={isLoading}
          disabled={!Object.keys(updateObj).length}
          onClick={handleSave}
        />
        <DeleteButton
          isLoading={isLoading}
          confirmDeleteTitle={t(
            'common.deleteConfirm',
            { item: app.name },
          )}
          onConfirmDelete={handleDelete}
        />
      </section>
    </section>
  )
}

export default Page
