import { getRegion } from '@lib/data/regions'
import { convertToLocale } from '@lib/util/money'
import { ProductTile } from '@modules/products/components/product-tile'
import { PRODUCT_LIMIT } from '@modules/search/actions'
import { Pagination } from '@modules/store/components/pagination'
import { SearchedProduct } from 'types/global'

export default async function PaginatedProducts({
  products,
  total,
  page,
  countryCode,
}: {
  products: SearchedProduct[]
  total: number
  page: number
  countryCode: string
}) {
  const totalPages = Math.ceil(total / PRODUCT_LIMIT)
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <ul
        className="grid w-full grid-cols-1 gap-x-2 gap-y-6 small:grid-cols-2 large:grid-cols-3"
        data-testid="products-list"
      >
        {products.map((p) => {
          const cheapestVariant = p.variants
            .filter((v) => !!v.calculated_price)
            .sort((a, b) => a.calculated_price.calculated_amount - b.calculated_price.calculated_amount)[0];
          return (
            <li key={p.id}>
              <ProductTile
                product={{
                  id: p.id,
                  created_at: p.created_at,
                  title: p.title,
                  handle: p.handle,
                  thumbnail: p.thumbnail,
                  calculatedPrice: convertToLocale({
                    amount: cheapestVariant?.calculated_price?.calculated_amount ?? 0,
                    currency_code: region.currency_code,
                  }),
                  salePrice: '', // Optionally use cheapestVariant?.calculated_price?.original_amount
                }}
                regionId={region.id}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
