import { productsApiRequest } from "@/app/api-request/products.api";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id
   
    // fetch data
    const product = await productsApiRequest.getProduct(id)
   
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
   
    return {
      title: product.payload.title,
    //   openGraph: {
    //     images: ['/some-specific-page-image.jpg', ...previousImages],
    //   },
    }
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
