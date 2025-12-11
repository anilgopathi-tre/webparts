
// helpers/NavApi.ts
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface NavNode {
  Id: number;
  Title: string;
  Url: string;
  IsExternal: boolean;
  Children?: NavNode[];
}

export async function getTopNav(hubUrl: string, ctx: any): Promise<NavNode[]> {
  const url = `${hubUrl}/_api/web/navigation/TopNavigationBar`;
  const res: SPHttpClientResponse = await ctx.spHttpClient.get(url, SPHttpClient.configurations.v1);
  const json = await res.json();

  const roots = (json.value ?? []).map((n: any) => ({
    Id: n.Id, Title: n.Title, Url: n.Url, IsExternal: n.IsExternal
  })) as NavNode[];

  // Load children per node
  const childrenPromises = roots.map(async r => {
    r.Children = await getChildren(hubUrl, ctx, r.Id);
    return r;
  });

  return await Promise.all(childrenPromises);
}

async function getChildren(hubUrl: string, ctx: any, nodeId: number): Promise<NavNode[]> {
  const url = `${hubUrl}/_api/web/Navigation/GetNodeById(${nodeId})/Children`;
  const res = await ctx.spHttpClient.get(url, SPHttpClient.configurations.v1);
  const json = await res.json();
  return (json.value ?? []).map((n: any) => ({
    Id: n.Id, Title: n.Title, Url: n.Url, IsExternal: n.IsExternal
  })) as NavNode[];
}
