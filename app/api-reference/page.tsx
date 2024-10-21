import Anchor from "@/components/anchor";
import { Leftbar } from "@/components/leftbar";
import Pre from "@/components/pre";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

export default async function APIReferencePage() {
  let data = await fetch(
    "https://documenter.gw.postman.com/api/collections/8832617/VVBWT6Qo?segregateAuth=true&versionTag=latest",
    { cache: "no-store" }
  );
  let posts = await data.json();
  console.log(posts.item);
  const menuItems = posts.item.map((parent: any) => ({
    name: parent.name,
    href: "#" + parent.name,
    item: parent.item.map((child: any) => ({
      name: child.name,
      id: child.id,
      href: "#" + child.id,
    })),
  }));
  return (
    <div className="flex items-start gap-14">
      <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-16 flex-col h-[92.75vh] overflow-y-auto">
        <ScrollArea className="py-4">
          <div className="flex flex-col gap-3.5 mt-5">
            {menuItems.map((item: any) => (
              <React.Fragment key={item.name}>
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx({
                    "pl-0": true,
                  })}
                >
                  {item.name}
                </Link>
                {item.item?.map((item: any) => (
                  <React.Fragment key={item.name}>
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx({
                        "pl-4": true,
                      })}
                    >
                      {item.name}
                    </Link>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <div className="flex-[4]">
        <div className="flex items-start gap-12">
          <div className="flex-[3] pt-10">
            <div className="prose prose-zinc dark:prose-invert prose-code:font-code dark:prose-code:bg-neutral-900 dark:prose-pre:bg-neutral-900 prose-code:bg-neutral-100 prose-pre:bg-neutral-100 prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-white prose-code:text-neutral-800 prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none">
              {posts.item.map((item: any) => (
                <React.Fragment key={item.id}>
                  <h1>{item.name}</h1>
                  <div>
                    {item.item?.map((item: any) => (
                      <React.Fragment key={item.id}>
                        <h2 id={item.id}>
                          <span className={item.request.method}>
                            {item.request.method}
                          </span>{" "}
                          {item.name}
                        </h2>
                        <div>
                          <pre>{item.url}</pre>
                          {item.description ? <p>{item.description}</p> : null}
                          <h5>Headers</h5>
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
                          {item.request.body ? (
                            <React.Fragment key={item.id + "_body"}>
                              <h5>Body</h5>
                              <Pre
                                raw={item.request.body.raw}
                                children={item.request.body.raw}
                              ></Pre>
                            </React.Fragment>
                          ) : null}
                          {item.response?.[0] ? (
                            <React.Fragment key={item.id + "_example"}>
                              <h4>Example</h4>
                              <Tabs
                                className="pt-5 pb-1"
                                defaultValue={item.response?.[0]?.id}
                              >
                                <TabsList className="">
                                  {item.response?.map((res: any) => (
                                    <React.Fragment key={res.id + "_tab"}>
                                      <TabsTrigger value={res.id}>
                                        {res.name}
                                      </TabsTrigger>
                                    </React.Fragment>
                                  ))}
                                </TabsList>
                                {item.response?.map((res: any) => (
                                  <React.Fragment key={res.id + "_content"}>
                                    <TabsContent value={res.id}>
                                      <h6>Request</h6>
                                      <Pre
                                        className="request"
                                        children={
                                          res.originalRequest?.body?.raw
                                        }
                                      ></Pre>
                                      {res.body ? (
                                        <React.Fragment
                                          key={res.id + "_content_res"}
                                        >
                                          <h6>Response</h6>
                                          <Pre
                                            className="response"
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
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
