export interface ConfigModuleOptions {
  isGlobal?: boolean;
  envFiles?: string[];
  load?: any[];
  cache?: boolean;
  expandVariables?: boolean;
  validationSchema?: any;
  validationOptions?: any;
}
