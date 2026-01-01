export type parseEcrResult = {
  account: string,
  region: string,
  registry: string,
  domain: string,
  name: string,
  tag: string,
};

export const parseEcr = (x: any): parseEcrResult => {
  ('string' !== typeof x) && (x = '');
  const r = {
    account: '', domain: '', region: '', registry: '', name: '', tag: '',
  };
  const matches = (<string>x).match(/^(([0-9]{12})\.dkr\.ecr\.(.+)\.amazonaws\.com)(\/([^:]+)(:.+)?)?$/);
  if (!matches) return r;
  r.domain = matches[1]
  r.account = matches[2];
  r.region = matches[3];
  matches[4] && (r.name = matches[4].slice(1).replace(/:.+$/, ''));
  matches[6] && (r.tag = matches[6].slice(1));
  r.name && (r.registry = `${r.domain}/${r.name}`);
  return r;
}

