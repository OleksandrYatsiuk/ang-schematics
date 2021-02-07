export interface ModuleOptions {
    module?: string;
    name: string;
    flat?: boolean;
    sourceDir?: string | undefined;
    path?: string;
    skipImport?: boolean;
    appRoot?: string;
    route: string;
  }