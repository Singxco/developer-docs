// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const APIROUTES: EachRoute[] = [
  {
    title: "Authentication",
    href: "/auth",
    noLink: true,
    items: [
      { title: "Details", href: "/details" }
    ],
  },
  {
    title: "Balance",
    href: "/balance",
    noLink: true,
    items: [
      { title: "History", href: "/history" }
    ],
  },
  {
    title: "FX",
    href: "/fx",
    noLink: true,
    items: [
      { title: "Corridors", href: "/corridors" },
      { title: "Exchange", href: "/exchange" }
    ],
  }
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = APIROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
