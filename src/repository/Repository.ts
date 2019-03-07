interface ListResult {
  data: [any],
  meta: {
    total: number,
    page: number,
    perPage: number
  }
}

interface Repository {
  show: (id: string) => Promise<any>
  list: (page: number, perPage: number) => Promise<ListResult>
  create: (data: any) => Promise<any>
  update: (id: string, data: any) => Promise<any>
  delete: (id: string) => Promise<any>
}

export default Repository