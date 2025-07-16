/* eslint-disable */
import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="bg-white absolute inset-0 h-fit">
      <ReactSwagger spec={spec} />
    </section>
  );
}