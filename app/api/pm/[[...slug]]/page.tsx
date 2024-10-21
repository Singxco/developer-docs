import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getMarkdownForSlug } from "@/lib/markdown";
import { PropsWithChildren, cache } from "react";
import Pre from "@/components/pre";
import path from "path";
import { promises as fs } from "fs";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
import EnvSwitch from "@/components/env-switch";
import dynamic from "next/dynamic";
const JsonHighlighter = dynamic(() => import("@/components/code"), {
  ssr: false,
});

type PageProps = {
  params: { slug: string[] };
};

const cachedJSON = cache(getJson);
const cachedGetMarkdownForSlug = cache(getMarkdownForSlug);

export default async function PmAPIPage({ params: { slug = [] } }: PageProps) {
  const pathName = slug.join("/");
  const res = await cachedJSON("api/pm", pathName);
  const desc = await cachedGetMarkdownForSlug("api/pm", pathName);
  let host = "https://external-api-uat.singx.co/business";
  const host_UAT = "https://external-api-uat.singx.co/business";
  const host_PROD = "https://external-api.singx.co/business";
  let env = "UAT";

  if (!res && !desc) notFound();
  const item = res ? JSON.parse(res) : undefined;

  return (
    <div className="flex items-start gap-12">
      <div className="flex-[3] pt-10">
        <div className="prose prose-zinc dark:prose-invert prose-code:font-code dark:prose-code:bg-neutral-900 dark:prose-pre:bg-neutral-900 prose-code:bg-neutral-100 prose-pre:bg-neutral-100 prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-white prose-code:text-neutral-800 prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none">
          <h2 id={item.id}>
            <span className={item.request.method}>{item.request.method}</span>{" "}
            {item.name}
          </h2>
          <p>
            {host}/{item.request.urlObject.path.join("/")}
          </p>
          {desc ? (
            <Markdown>
              <h1>{desc?.frontmatter.title}</h1>
              <p className="-mt-4 text-muted-foreground text-[16.5px]">
                {desc?.frontmatter.description}
              </p>
              <div>{desc?.content}</div>
            </Markdown>
          ) : null}
          <div>
            <pre>{item.url}</pre>
            {item.description ? <p>{item.description}</p> : null}
            <h4>Headers</h4>
            <Table>
              <TableBody>
                {item.request?.header?.map((h: any) => (
                  <React.Fragment key={item.id + h.key}>
                    <TableRow>
                      <TableCell>{h.key}</TableCell>
                      <TableCell>{h.value}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {item.request.urlObject.query &&
            item.request.urlObject.query.length > 0 ? (
              <>
                <h4>Params</h4>
                <Table>
                  <TableBody>
                    {item.request.urlObject.query?.map((h: any) => (
                      <React.Fragment key={item.id + h.key}>
                        <TableRow>
                          <TableCell>{h.key}</TableCell>
                          <TableCell>{h.value}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : null}
            {item.request.body ? (
              <React.Fragment key={item.id + "_body"}>
                <h5 className="mt-4">Request Body</h5>
                <Pre
                  className="not-prose"
                  raw={item.request.body.raw}
                  children={item.request.body.raw}
                ></Pre>
              </React.Fragment>
            ) : null}
            {item.response?.[0] ? (
              <React.Fragment key={item.id + "_example"}>
                <h4 className="mt-4">Example</h4>
                <Tabs
                  className="pt-5 pb-1"
                  defaultValue={item.response?.[0]?.id}
                >
                  <TabsList className="">
                    {item.response?.map((res: any) => (
                      <React.Fragment key={res.id + "_tab"}>
                        <TabsTrigger value={res.id}>{res.name}</TabsTrigger>
                      </React.Fragment>
                    ))}
                  </TabsList>
                  {item.response?.map((res: any) => (
                    <React.Fragment key={res.id + "_content"}>
                      <TabsContent value={res.id}>
                        {res.originalRequest?.body ? (
                          <React.Fragment key={res.id + "_content_req"}>
                            <h6 className="mt-4">Request</h6>
                            <Pre
                              className="request not-prose"
                              children={res.originalRequest?.body}
                            ></Pre>
                            <JsonHighlighter
                              jsonData={JSON.parse(res.originalRequest?.body)}
                            />
                          </React.Fragment>
                        ) : null}
                        {res.body ? (
                          <React.Fragment key={res.id + "_content_res"}>
                            <h6 className="mt-4">Response</h6>
                            <Pre
                              className="response not-prose"
                              children={res.body}
                            ></Pre>
                          </React.Fragment>
                        ) : null}
                      </TabsContent>
                    </React.Fragment>
                  ))}
                </Tabs>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </div>
      <div className="lg:flex hidden toc flex-[1] min-w-[230px] py-8 sticky top-16 h-[95.95vh]">
        <div className="flex flex-col gap-3 w-full">
          <EnvSwitch />
        </div>
      </div>
    </div>
  );
}

function Markdown({ children }: PropsWithChildren) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-code:font-code dark:prose-code:bg-neutral-900 dark:prose-pre:bg-neutral-900 prose-code:bg-neutral-100 prose-pre:bg-neutral-100 prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-white prose-code:text-neutral-800 prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none">
      {children}
    </div>
  );
}

export async function generateMetadata({ params: { slug = [] } }: PageProps) {
  const pathName = slug.join("/");
  const res = await cachedGetMarkdownForSlug("api/pm", pathName);
  if (!res) return null;
  return {
    title: pathName + " - SingX Developer Portal",
    description: pathName,
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}

export async function getJson(dir: string, slug: string) {
  try {
    const contentPath = getContentPath(dir, slug);
    return await fs.readFile(contentPath, "utf-8");
  } catch (err) {
    console.log(err);
  }
}

function getContentPath(dir: string, slug: string) {
  console.log(dir, slug);
  return path.join(process.cwd(), "/contents/", dir, `/${slug}/index.json`);
}
