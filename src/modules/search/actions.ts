import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import { SearchedProducts } from 'types/global'

export const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
export const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const PRODUCT_LIMIT = 12

type SearchParams = {
  page?: number
  order?: string
  category_id?: string
  collection?: string[]
  type?: string[]
  material?: string[]
  price?: string[]
  query?: string
  region_id?: string
}

export async function search({
  page,
  order = 'relevance',
  category_id,
  collection,
  type,
  material,
  price,
  query,
  region_id,
}: SearchParams): Promise<SearchedProducts> {
  const sortBy =
    order === 'price_asc'
      ? 'calculated_price'
      : order === 'price_desc'
        ? '-calculated_price'
        : order === 'created_at'
          ? '-created_at'
          : order

  let searchParams: URLSearchParams
  if (order === 'relevance') {
    searchParams = new URLSearchParams({
      offset: ((page - 1) * PRODUCT_LIMIT).toString(),
      limit: PRODUCT_LIMIT.toString(),
    })
  } else {
    searchParams = new URLSearchParams({
      order: sortBy,
      offset: ((page - 1) * PRODUCT_LIMIT).toString(),
      limit: PRODUCT_LIMIT.toString(),
    })
  }

  if (region_id) {
    searchParams.append('region_id', region_id)
  }

  if (category_id) {
    searchParams.append('category_id[]', category_id)
  }

  if (collection && Array.isArray(collection)) {
    collection.forEach((id) => {
      searchParams.append('collection_id[]', id)
    })
  }

  if (type && Array.isArray(type)) {
    type.forEach((id) => {
      searchParams.append('type_id[]', id)
    })
  }

  if (material && Array.isArray(material)) {
    material.forEach((id) => {
      searchParams.append('materials[]', id)
    })
  }

  if (price && Array.isArray(price)) {
    price.forEach((range) => {
      switch (range) {
        case 'under-100':
          searchParams.append('price_to', '100')
          break
        case '100-500':
          searchParams.append('price_from', '100')
          searchParams.append('price_to', '500')
          break
        case '501-1000':
          searchParams.append('price_from', '501')
          searchParams.append('price_to', '1000')
          break
        case 'more-than-1000':
          searchParams.append('price_from', '1000')
          break
      }
    })
  }

  if (query) {
    searchParams.append('q', safeDecodeURIComponent(query))
  }

  const response = await fetch(
    `${BACKEND_URL}/store/products?${searchParams.toString()}`,
    {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY!,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Response error. Status: ${response.status}`)
  }

  const data = await response.json()

  return {
    results: data.products,
    count: data.count,
  }
}
