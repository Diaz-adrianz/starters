export type Permission = {
  id: string;
  module: string;
  resource: string;
  action: string;
  description: string;
  enabled: boolean;
};
