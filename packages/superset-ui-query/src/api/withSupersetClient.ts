import { SupersetClientInterface, SupersetClient } from '@superset-ui/connection';

type ApiCallParams<T> = T & {
  client: SupersetClientInterface;
};

type ApiCall<T, Output> = (params: ApiCallParams<T>) => Output;

export default function withSupersetClient<T, Output>(func: ApiCall<T, Output>) {
  return (
    params: Omit<T, 'client'> & {
      client?: SupersetClientInterface;
    },
  ) => {
    const { client } = params;

    return func({ ...params, client: client || SupersetClient } as ApiCallParams<T>);
  };
}

const fx = withSupersetClient(
  ({ client, test }: { test: string; client: SupersetClientInterface }) => client.post({} as any),
);

fx({ test: '123' });
