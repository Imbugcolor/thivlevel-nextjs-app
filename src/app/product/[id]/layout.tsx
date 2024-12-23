import { productsApiRequest } from "@/app/api-request/products.api";
import { getIdFromSlug } from "@/lib/utils/func";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.id

  const productId = getIdFromSlug(slug);

  if (productId) {
    // fetch data
    try {
      const product = await productsApiRequest.getProduct(productId)

      // optionally access and extend (rather than replace) parent metadata
      // const previousImages = (await parent).openGraph?.images || []
      if (product) {
        return {
          title: product.payload.title,
          openGraph: {
            images: product.payload.images[0].url,
          },
        }
      }
    } catch (error) {
      return notFound()
    }
  }
  notFound()
}

export default function ProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}
